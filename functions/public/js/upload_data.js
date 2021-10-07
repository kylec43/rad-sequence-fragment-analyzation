import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-storage.js";
import { getFirestore, collection, addDoc, setDoc, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";


async function uploadSelection(){

    if(selectType.value === "Genome"){
        await uploadGenome(selectionName.value, genomeFile);
    } else {
        await uploadRestrictionEnzyme(selectionName, genomeFile)
    }
}
async function uploadGenome(name, genomeToUpload){
    
    //Get genomeFile text
    console.log("getting file name")
    const fileName = Date.now() + genomeToUpload.name; // unique name

    console.log("get reference in storage");
    const fileRef = ref(getStorage(), GENOME_FOLDER + fileName);
    
    console.log("uploading file")
    let taskSnapshot = await uploadBytes(fileRef, genomeFile);
    taskSnapshot

    console.log("getting download url");
    let downloadUrl;
    await getDownloadURL(fileRef).then((url)=>{
        downloadUrl = url;
    })

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
}

async function uploadRestrictionEnzyme(name, restrictionEnzyme){
    
}

var genomeFile;
genomeFileInput.addEventListener('change', e => {
    console.log('selected!');
    genomeFile = e.target.files[0];
    console.log('file upload', e.target.files[0]);
});

document.getElementById('submitButton').addEventListener("click", uploadSelection);


