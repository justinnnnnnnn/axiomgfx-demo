import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cid = searchParams.get('cid');
    const smiles = searchParams.get('smiles');
    const get3d = searchParams.get('get3d');

    if (!cid && !smiles) {
      return NextResponse.json({ error: 'cid or smiles parameter required' }, { status: 400 });
    }

    if (cid) {
      console.log(`Proxying SDF request for CID: ${cid}`);

      // Fetch SDF from PubChem
      const pubchemUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/record/SDF?record_type=3d`;

      const response = await fetch(pubchemUrl, {
        headers: {
          'User-Agent': 'AxiomGFX/1.0 (https://axiomgfx.com)',
          'Accept': 'chemical/x-mdl-sdfile,text/plain,*/*'
        }
      });

      if (!response.ok) {
        console.error(`PubChem SDF fetch failed: ${response.status} ${response.statusText}`);
        return NextResponse.json(
          { error: `Failed to fetch SDF: ${response.statusText}` },
          { status: response.status }
        );
      }

      const sdfData = await response.text();
      console.log(`Successfully fetched SDF for CID ${cid}, length: ${sdfData.length}`);

      // Return SDF with proper headers
      return new NextResponse(sdfData, {
        status: 200,
        headers: {
          'Content-Type': 'chemical/x-mdl-sdfile',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (smiles) {
      const id = encodeURIComponent(smiles);
      const want3d = get3d === 'true';

      let cactusUrl = `https://cactus.nci.nih.gov/chemical/structure/${id}/sdf` + (want3d ? `?get3d=true` : ``);
      console.log(`Proxying SDF request for SMILES via Cactus: ${cactusUrl}`);

      let response = await fetch(cactusUrl, {
        headers: {
          'User-Agent': 'AxiomGFX/1.0 (https://axiomgfx.com)',
          'Accept': 'chemical/x-mdl-sdfile,text/plain,*/*'
        }
      });

      // Try alternate endpoint if initial fails
      if (!response.ok) {
        const altUrl = `https://cactus.nci.nih.gov/chemical/structure/${id}/file?format=sdf` + (want3d ? `&get3d=true` : ``);
        console.warn(`Primary Cactus endpoint failed (${response.status}); trying alt: ${altUrl}`);
        response = await fetch(altUrl, {
          headers: {
            'User-Agent': 'AxiomGFX/1.0 (https://axiomgfx.com)',
            'Accept': 'chemical/x-mdl-sdfile,text/plain,*/*'
          }
        });
      }

      if (!response.ok) {
        console.error(`Cactus SDF fetch failed: ${response.status} ${response.statusText}`);
        return NextResponse.json(
          { error: `Failed to fetch SDF from Cactus: ${response.statusText}` },
          { status: response.status }
        );
      }

      const sdfData = await response.text();
      console.log(`Successfully fetched SDF for SMILES, length: ${sdfData.length}`);

      return new NextResponse(sdfData, {
        status: 200,
        headers: {
          'Content-Type': 'chemical/x-mdl-sdfile',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Should not reach here
    return NextResponse.json({ error: 'Unhandled request' }, { status: 400 });

  } catch (error) {
    console.error('Error in SDF proxy:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SDF data' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
