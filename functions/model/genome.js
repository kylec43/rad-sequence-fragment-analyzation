class Genome{
    constructor(name, dnaSequence){
        this.name = name;
        this.dnaSequence = dnaSequence;
    }

    serialize(){
        return {
            "name": this.name,
            "dnaSequence": this.dnaSequence,
        }
    }

    deserialize(genome){
        return Genome(genome["name"], genome["dnaSequence"]);
    }
}

module.exports = Genome;