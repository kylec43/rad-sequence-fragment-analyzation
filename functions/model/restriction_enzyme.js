class RestrictionEnzyme{
    constructor(name, restrictionSite){
        this.name = name;
        this.restrictionSite = this.restrictionSite;
    }

    serialize(){
        return {
            "name": this.name,
            "restrictionSite": this.restrictionSite,
        }
    }

    deserialize(genome){
        return Genome(genome["name"], genome["restrictionSite"]);
    }
}

module.exports = RestrictionEnzyme;