import { getFirestore, setDoc, doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";


window.updateRestrictionEnzyme = async function updateRestrictionEnzyme(name, restrictionSite){

    try{

        console.log("updating firestore");
        var docRef = doc(getFirestore(), 'restriction_enzymes', DOC_NAME)
        
        restriction_enzymes[enzymeSelect.selectedIndex].name = enzymeName.value
        restriction_enzymes[enzymeSelect.selectedIndex].restrictionSite = enzymeSite.value

        await setDoc(docRef, {restriction_enzymes});
        document.getElementById(restriction_enzymes[enzymeSelect.selectedIndex]['id']).innerHTML = enzymeName.value;

        console.log("file updated")

        
    } catch(e){
        console.log('update failed');
        error.style.display = "block";
        error.innerHTML = `${e}`;
    }



}



window.deleteRestrictionEnzyme = async function deleteRestrictionEnzyme(name, restrictionSite){

    try{

        console.log("removing from firestore");
        var docRef = doc(getFirestore(), 'restriction_enzymes', DOC_NAME)

        restriction_enzymes.splice(enzymeSelect.selectedIndex, 1)

        await setDoc(docRef, {restriction_enzymes});
        var temp = enzymeSelect.selectedIndex;
        enzymeSelect.remove(enzymeSelect.selectedIndex);

        if(temp === restriction_enzymes.length + 1){
            enzymeSelect.selectedIndex = temp-1;
        } else if (temp === 0 && restriction_enzymes.length !== 0){
            enzymeSelect.selectedIndex = temp+1;
        }


        console.log("enzyme removed")

        
    } catch(e){
        console.log('remove failed');
        error.style.display = "block";
        error.innerHTML = `${e}`;
    }



}