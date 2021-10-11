import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-storage.js";
import { getFirestore, collection, addDoc, setDoc, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";


window.uploadSelection = async function uploadSelection(){
    console.log("YES!");
    if(selectType.value === "Genome"){
        await uploadGenome(selectionName.value, genomeFile);
    } else {
        await uploadRestrictionEnzyme(selectionName, genomeFile)
    }
}
window.uploadGenome = async function uploadGenome(name, genomeToUpload){
    
    //Get genomeFile text
    console.log("getting file name")
    const fileName = Date.now() + genomeToUpload.name; // unique name

    console.log("get reference in storage");
    const fileRef = ref(getStorage(), GENOME_FOLDER + fileName);
    
    console.log("uploading file")
    uploadProgressDiv.style.display = "block";
    submitButton.style.display = "none";
    let uploadTask = uploadBytesResumable(fileRef, genomeFile);


    uploadTask.on('state_changed', (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    progressBar.style.width = `${progress}%`;

  }, (error) => {
    console.log(`Failed: ${error}`);
    uploadProgressDiv.style.display = "none";
    submitButton.style.display = "inline-block";
  }, 
  async () => {
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
    submitButton.style.display = "inline-block";
  }
);


}

window.uploadRestrictionEnzyme = async function uploadRestrictionEnzyme(name, restrictionEnzyme){
    
}


var genomeFile;
genomeFileInput.addEventListener('change', e => {
    console.log('selected!');
    genomeFile = e.target.files[0];
    console.log('file upload', e.target.files[0]);
});

document.getElementById('submitButton').addEventListener("click", uploadSelection);


