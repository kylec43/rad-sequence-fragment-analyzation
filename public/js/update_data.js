import { getFirestore, setDoc, doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
import { getStorage, ref, deleteObject } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-storage.js";


window.updateRestrictionEnzyme = async function updateRestrictionEnzyme(){

    try{
        updateEnzymeProgressDiv.style.display = "block";
        enzymePropertiesButtonsDiv.style.display = "none";

        console.log("updating firestore");
        var docRef = doc(getFirestore(), 'restriction_enzymes', DOC_NAME)
        
        restriction_enzymes[enzymeSelect.selectedIndex].name = enzymeName.value
        restriction_enzymes[enzymeSelect.selectedIndex].restrictionSite = enzymeSite.value

        await setDoc(docRef, {restriction_enzymes});
        document.getElementById(restriction_enzymes[enzymeSelect.selectedIndex]['id']).innerHTML = enzymeName.value;

        console.log("file updated")
        enzymePropertiesButtonsDiv.style.display = "block";
        updateEnzymeProgressDiv.style.display = "none";
        
    } catch(e){
        console.log('update failed');
        error.style.display = "block";
        error.innerHTML = `${e}`;
        enzymePropertiesButtonsDiv.style.display = "block";
        updateEnzymeProgressDiv.style.display = "none";
    }




}



window.deleteRestrictionEnzyme = async function deleteRestrictionEnzyme(){

    try{
        deleteEnzymeProgressDiv.style.display = "block";
        enzymePropertiesButtonsDiv.style.display = "none";

        console.log("removing from firestore");
        var docRef = doc(getFirestore(), 'restriction_enzymes', DOC_NAME)

        restriction_enzymes.splice(enzymeSelect.selectedIndex, 1)

        await setDoc(docRef, {restriction_enzymes});
        enzymeSelect.remove(enzymeSelect.selectedIndex);

        if(restriction_enzymes.length !== 0){
            enzymeName.value = restriction_enzymes[enzymeSelect.selectedIndex].name;
            enzymeSite.value = restriction_enzymes[enzymeSelect.selectedIndex].restrictionSite;
        } else {
            enzymeName.value = "";
            enzymeSite.value = "";
            enzymeUpdateButton.disabled = true;
            enzymeDeleteButton.disabled = true;
        }

        console.log("enzyme removed")
        enzymePropertiesButtonsDiv.style.display = "block";
        deleteEnzymeProgressDiv.style.display = "none";
    

        
    } catch(e){
        console.log(`remove failed ${e}`);
        error.style.display = "block";
        error.innerHTML = `${e}`;
        enzymePropertiesButtonsDiv.style.display = "block";
        deleteEnzymeProgressDiv.style.display = "none";
    
    }


}



window.updateGenome = async function updateGenome(){

    try{
        updateGenomeProgressDiv.style.display = "block";
        genomePropertiesButtonsDiv.style.display = "none";

        console.log("updating firestore");
        var docRef = doc(getFirestore(), 'genomes', DOC_NAME)
        
        genomes[genomeSelect.selectedIndex].name = genomeName.value

        await setDoc(docRef, {genomes});
        document.getElementById(genomes[genomeSelect.selectedIndex]['fileName']).innerHTML = genomeName.value;

        console.log("file updated")
        genomePropertiesButtonsDiv.style.display = "block";
        updateGenomeProgressDiv.style.display = "none";
        
    } catch(e){
        console.log('update failed');
        error.style.display = "block";
        error.innerHTML = `${e}`;
        genomePropertiesButtonsDiv.style.display = "block";
        updateGenomeProgressDiv.style.display = "none";
    }




}



window.deleteGenome = async function deleteGenome(){

    try{
        deleteGenomeProgressDiv.style.display = "block";
        genomePropertiesButtonsDiv.style.display = "none";

        console.log("removing from firestore");
        var fileName = genomes[genomeSelect.selectedIndex].fileName;
        var docRef = doc(getFirestore(), 'genomes', DOC_NAME)

        genomes.splice(genomeSelect.selectedIndex, 1)

        await setDoc(docRef, {genomes});
        genomeSelect.remove(genomeSelect.selectedIndex);

        if(genomes.length !== 0){
            genomeName.value = genomes[genomeSelect.selectedIndex].name;
        } else {
            genomeName.value = "";
            genomeUpdateButton.disabled = true;
            genomeDeleteButton.disabled = true;
        }

        const genomeRef = ref(getStorage(), `${GENOME_FOLDER}/${fileName}`);

        await deleteObject(genomeRef).then(() => {

        }).catch((e)=>{
            throw e;
        });

        console.log("genome removed")
        genomePropertiesButtonsDiv.style.display = "block";
        deleteGenomeProgressDiv.style.display = "none";
    

        
    } catch(e){
        console.log(`remove failed ${e}`);
        error.style.display = "block";
        error.innerHTML = `${e}`;
        genomePropertiesButtonsDiv.style.display = "block";
        deleteGenomeProgressDiv.style.display = "none";
    
    }


}