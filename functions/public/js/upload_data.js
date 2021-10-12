import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-storage.js";
import { getFirestore, collection, addDoc, setDoc, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";


window.promptPassword = async function promptPassword(){
    passwordPromptBlock.style.display = "block";
    uploadButton.style.display = "none";
}

window.uploadSelection = async function(){
    try{
        uploadError.style.display = "none";
        uploadError.innerHTML = "";

        if(selectType.value == "Genome"){
            if(!authenticated){
                promptPassword();
            } else {
                await uploadGenome(selectionName.value, genomeFile);
            }
        } else {
            if(!authenticated){
                promptPassword();
            } else {
                await uploadRestrictionEnzyme(selectionName.value, rsInput.value);
            }
        }
    } catch(e){
        console.log(`Error: ${e}`);
        uploadError.style.display = "block";
        uploadError.innerHTML = `${e}`;
    }
}

window.uploadGenome = async function uploadGenome(name, genomeToUpload){
    
    uploadError.style.innerHTML = "";
    uploadError.style.display = "none";

    //Get genomeFile text
    console.log("getting file name")
    const fileName = Date.now() + genomeToUpload.name; // unique name

    console.log("get reference in storage");
    const fileRef = ref(getStorage(), GENOME_FOLDER + fileName);
    
    console.log("uploading file")
    uploadProgressDiv.style.display = "block";
    passwordPromptBlock.style.display = "none";
    let uploadTask = uploadBytesResumable(fileRef, genomeFile);


    uploadTask.on('state_changed', (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    progressBar.style.width = `${progress}%`;

  }, (e) => {
    uploadProgressDiv.style.display = "none";
    uploadButton.style.display = "inline-block";
    uploadError.innerHTML = `${e}`;
    uploadError.style.display = "block";
  }, 
  async () => {

    try{
        console.log("getting download url");
        let downloadUrl;
        await getDownloadURL(fileRef).then((url)=>{
            downloadUrl = url;
        });

        console.log("uploading to firestore");
        var docRef = doc(getFirestore(), 'genomes', DOC_NAME)
        var docSnap = await getDoc(docRef);
        
        if(docSnap.exists()){
            let data = docSnap.data();
            data["genomes"].push({'name': name, 'fileName': fileName, 'downloadURL': downloadUrl});
            await setDoc(doc(getFirestore(), 'genomes', DOC_NAME), data);
        } else {
            await setDoc(doc(getFirestore(), 'genomes', DOC_NAME), {'genomes': [{'name': name, 'fileName': fileName, 'downloadURL': downloadUrl}]});
        }

        console.log("file uploaded")
        uploadProgressDiv.style.display = "none";
        uploadButton.style.display = "inline-block";
    } catch(e){
        uploadProgressDiv.style.display = "none";
        uploadButton.style.display = "inline-block";
        uploadError.innerHTML = `${e}`;
        uploadError.style.display = "block";
        console.log('upload failed');
    }
  }
);


}

window.uploadRestrictionEnzyme = async function uploadRestrictionEnzyme(name, restrictionSite){
    uploadError.style.innerHTML = "";
    uploadError.style.display = "none";
    uploadProgressDiv.style.display = "block";
    passwordPromptBlock.style.display = "none";

    try{

        console.log("uploading to firestore");
        var docRef = doc(getFirestore(), 'restriction_enzymes', DOC_NAME)
        var docSnap = await getDoc(docRef);
        
        if(docSnap.exists()){
            let data = docSnap.data();
            data["restriction_enzymes"].push({'name': name, 'restrictionSite': restrictionSite, 'id': `${Date.now()}${name}${restrictionSite}`});
            await setDoc(doc(getFirestore(), 'restriction_enzymes', DOC_NAME), data);
        } else {
            await setDoc(doc(getFirestore(), 'restriction_enzymes', DOC_NAME), {'restriction_enzymes': [{'name': name, 'restriction_site': restrictionSite, 'id': `${Date.now()}${name}${restrictionSite}`}]});
        }

        console.log("file uploaded")
        uploadProgressDiv.style.display = "none";
        uploadButton.style.display = "inline-block";
    } catch(e){
        uploadProgressDiv.style.display = "none";
        uploadButton.style.display = "inline-block";
        uploadError.innerHTML = `${e}`;
        uploadError.style.display = "block";
        console.log('upload failed');
    }



}


window.genomeFile = null;
genomeFileInput.addEventListener('change', e => {
    console.log('selected!');
    window.genomeFile = e.target.files[0];
    console.log('file upload', e.target.files[0]);
});

//document.getElementById('uploadButton').addEventListener("click", uploadSelection);


