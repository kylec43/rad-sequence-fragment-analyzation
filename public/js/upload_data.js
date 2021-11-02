import { getFirestore, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";


window.uploadRestrictionEnzyme = async function uploadRestrictionEnzyme(name, restrictionSite){

    try{

        uploadButton.style.display = "none";
        uploadingDiv.style.display = "flex";

        console.log("uploading to firestore");
        var docRef = doc(getFirestore(), 'restriction_enzymes', DOC_NAME)
        var docSnap = await getDoc(docRef);
        
        if(docSnap.exists()){
            let data = docSnap.data();
            data["restriction_enzymes"].push({'name': name, 'restrictionSite': restrictionSite, 'id': `${Date.now()}${name}${restrictionSite}`});
            await setDoc(docRef, data);
        } else {
            await setDoc(docRef, {'restriction_enzymes': [{'name': name, 'restrictionSite': restrictionSite, 'id': `${Date.now()}${name}${restrictionSite}`}]});
        }

        console.log("file uploaded")

        
    } catch(e){
        console.log('upload failed');
    }

    console.log("done");
}
