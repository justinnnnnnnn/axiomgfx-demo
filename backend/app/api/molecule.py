"""
Molecular data API endpoints for fetching real 3D structures from PubChem and other sources.
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import httpx
import json
from typing import Optional, Dict, Any
from pydantic import BaseModel

router = APIRouter(prefix="/api/molecule", tags=["molecule"])

class MoleculeResolveRequest(BaseModel):
    name: str

class MoleculeResolveResponse(BaseModel):
    source: str
    name: str
    cid: Optional[int]
    smiles: Optional[str]
    inchi: Optional[str]
    sdf3d_url: Optional[str]
    molecular_formula: Optional[str]
    molecular_weight: Optional[float]

@router.post("/resolve", response_model=MoleculeResolveResponse)
async def resolve_molecule(request: MoleculeResolveRequest):
    """
    Resolve a molecule name to get 3D structure data and identifiers.
    
    Steps:
    1. Try PubChem name -> CID
    2. Get 3D SDF URL and basic properties
    3. Fallback to OPSIN/CIR if needed
    """
    name = request.name.strip().lower()
    
    try:
        # Step 1: Get CID from PubChem
        async with httpx.AsyncClient() as client:
            # Try PubChem name lookup
            pubchem_url = f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/{name}/cids/JSON"
            response = await client.get(pubchem_url)
            
            if response.status_code == 200:
                data = response.json()
                cid = data["IdentifierList"]["CID"][0]
                
                # Get additional properties
                props_url = f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/{cid}/property/IsomericSMILES,InChI,InChIKey,MolecularFormula,MolecularWeight/JSON"
                props_response = await client.get(props_url)
                
                if props_response.status_code == 200:
                    props_data = props_response.json()
                    properties = props_data["PropertyTable"]["Properties"][0]
                    
                    # Check if 3D structure is available
                    sdf3d_url = f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/{cid}/record/SDF?record_type=3d"
                    sdf3d_check = await client.head(sdf3d_url)
                    
                    return MoleculeResolveResponse(
                        source="pubchem",
                        name=name,
                        cid=cid,
                        smiles=properties.get("IsomericSMILES"),
                        inchi=properties.get("InChI"),
                        sdf3d_url=sdf3d_url if sdf3d_check.status_code == 200 else None,
                        molecular_formula=properties.get("MolecularFormula"),
                        molecular_weight=properties.get("MolecularWeight")
                    )
            
            # Fallback to OPSIN
            opsin_url = f"https://opsin.ch.cam.ac.uk/opsin/{name}.json"
            opsin_response = await client.get(opsin_url)
            
            if opsin_response.status_code == 200:
                opsin_data = opsin_response.json()
                return MoleculeResolveResponse(
                    source="opsin",
                    name=name,
                    cid=None,
                    smiles=opsin_data.get("smiles"),
                    inchi=opsin_data.get("stdinchi"),
                    sdf3d_url=None,
                    molecular_formula=None,
                    molecular_weight=None
                )
            
            # Final fallback to NIH CIR
            cir_url = f"https://cactus.nci.nih.gov/chemical/structure/{name}/smiles"
            cir_response = await client.get(cir_url)
            
            if cir_response.status_code == 200:
                smiles = cir_response.text.strip()
                return MoleculeResolveResponse(
                    source="cir",
                    name=name,
                    cid=None,
                    smiles=smiles,
                    inchi=None,
                    sdf3d_url=None,
                    molecular_formula=None,
                    molecular_weight=None
                )
    
    except Exception as e:
        print(f"Error resolving molecule {name}: {e}")
    
    raise HTTPException(status_code=404, detail="Molecule not found")

@router.get("/by-name/{name}/sdf3d")
async def get_molecule_sdf3d_by_name(name: str):
    """
    Get 3D SDF structure file by molecule name.
    """
    try:
        # First resolve the name to get CID
        resolve_request = MoleculeResolveRequest(name=name)
        molecule_data = await resolve_molecule(resolve_request)
        
        if not molecule_data.sdf3d_url:
            raise HTTPException(status_code=404, detail="3D structure not available")
        
        # Stream the SDF file
        async with httpx.AsyncClient() as client:
            response = await client.get(molecule_data.sdf3d_url)
            if response.status_code == 200:
                return StreamingResponse(
                    iter([response.content]),
                    media_type="chemical/x-mdl-sdfile",
                    headers={"Content-Disposition": f"attachment; filename={name}.sdf"}
                )
    
    except Exception as e:
        print(f"Error getting SDF for {name}: {e}")
    
    raise HTTPException(status_code=404, detail="SDF file not found")

@router.get("/{cid}/sdf3d")
async def get_molecule_sdf3d_by_cid(cid: int):
    """
    Get 3D SDF structure file by PubChem CID.
    """
    try:
        sdf3d_url = f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/{cid}/record/SDF?record_type=3d"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(sdf3d_url)
            if response.status_code == 200:
                return StreamingResponse(
                    iter([response.content]),
                    media_type="chemical/x-mdl-sdfile",
                    headers={"Content-Disposition": f"attachment; filename=compound_{cid}.sdf"}
                )
    
    except Exception as e:
        print(f"Error getting SDF for CID {cid}: {e}")
    
    raise HTTPException(status_code=404, detail="SDF file not found")

# Compound name mappings for our pharmaceutical compounds
COMPOUND_NAME_MAPPINGS = {
    "Metformin": "metformin",
    "Nefazodone": "nefazodone", 
    "Troglitazone": "troglitazone",
    "Aspirin": "aspirin",
    "Atorvastatin": "atorvastatin",
    "Lisinopril": "lisinopril",
    "Ketoconazole": "ketoconazole",
    "Diclofenac": "diclofenac",
    "Amiodarone": "amiodarone",
    "Warfarin": "warfarin",
    "Phenytoin": "phenytoin",
    "Carbamazepine": "carbamazepine",
    "Valproic Acid": "valproic acid",
    "Ibuprofen": "ibuprofen",
    "Acetaminophen": "acetaminophen",
    "Simvastatin": "simvastatin",
    "Lovastatin": "lovastatin",
    "Pravastatin": "pravastatin",
    "Rosuvastatin": "rosuvastatin",
    "Fluvastatin": "fluvastatin"
}

@router.get("/compound-mapping/{compound_name}")
async def get_compound_mapping(compound_name: str):
    """
    Get the standardized name mapping for our pharmaceutical compounds.
    """
    mapped_name = COMPOUND_NAME_MAPPINGS.get(compound_name, compound_name.lower())
    return {"original_name": compound_name, "mapped_name": mapped_name}

@router.get("/healthz")
async def health_check():
    """Health check endpoint."""
    return {"ok": True}
