// redmenace, if you see this, you totally have permission to copy as much as you want :)

var Allele;

(function (Allele) {
    Allele[Allele["G"] = 0] = "G";
    Allele[Allele["H"] = 1] = "H";
    Allele[Allele["W"] = 2] = "W";
    Allele[Allele["X"] = 3] = "X";
    Allele[Allele["Y"] = 4] = "Y";
})(Allele || (Allele = {}));

const NUM_ALLALE = 5;
const GENOME_SIZE = 6;

function getAlleleWeight(a) {
    if (isPositiveAllele(a)) {
        return 10;
    } else {
        return 19;
    }
}

function isPositiveAllele(a) {
    if (Allele[a] == "W" || Allele[a] == "X") {
        return false;
    } else {
        return true;
    }
}

class Genome {
    constructor(genes) {
        this.genes = genes;
    }

    getAllele(i) {
        return this.genes[i];
    }

    getNumberOfMatchingAlleles(other) {
        var retv = 0;
        for (var i = 0; i < this.genes.length; i++) {
            if (this.genes[i] == other.genes[i]) {
                retv++;
            }
        }
        return retv;
    }

    getNumberOfMatchingAllelesInAnyPosition(other) {
        var thisFreq = [];
        var otherFreq = [];

        for (var i = 0; i < NUM_ALLALE; i++) {
            thisFreq[i] = 0;
            otherFreq[i] = 0;
        }

        for (var i = 0; i < this.genes.length; i++) {
            thisFreq[this.genes[i]]++;
            otherFreq[other.genes[i]]++;
        }

        var retv = 0;

        for (var i = 0; i < thisFreq.length; i++) {
            retv += Math.min(thisFreq[i], otherFreq[i]);
        }

        return retv;
    }

    toString() {
        var r = "";

        this.genes.forEach(g => {
            r += Allele[g];
        });

        return r;
    }
}

function parseGenome(s) {
    return new Genome([
        Allele[s.substring(0, 1)],
        Allele[s.substring(1, 2)],
        Allele[s.substring(2, 3)],
        Allele[s.substring(3, 4)],
        Allele[s.substring(4, 5)],
        Allele[s.substring(5, 6)],
    ]);
}

class BreedingSet {
    constructor(genomes) {
        this.genomes = genomes;
    }

    getPossibleResults() {
        if (this.genomes.length == 0) {
            return [];
        }

        var possibleAlleles = [];

        for (var i = 0; i < GENOME_SIZE; i++) {
            var weights = [];
            for (var j = 0; j < NUM_ALLALE; j++) {
                weights.push(0);
            }
            for (var j = 1; j < this.genomes.length; j++) {
                var g = this.genomes[j];
                var a = g.getAllele(i);
                weights[a] += getAlleleWeight(a);
            }
            var maxWeight = 0;
            for (var j = 0; j < weights.length; j++) {
                if (weights[j] > maxWeight) {
                    maxWeight = weights[j];
                }
            }
            var pos = [];
            var baseAllele = this.genomes[0].getAllele(i);
            if (maxWeight > getAlleleWeight(baseAllele)) {
                for (var j = 0; j < weights.length; j++) {
                    if (weights[j] == maxWeight) {
                        pos.push(Allele[Allele[j]]);
                    }
                }
            } else {
                pos.push(baseAllele);
            }
            possibleAlleles.push(pos);
        }

        var c = [];

        for (var i = 0; i < GENOME_SIZE; i++) {
            c[i] = 0;
        }

        var retv = [];

        while (true) {
            var genes = [];
            for (var i = 0; i < GENOME_SIZE; i++) {
                genes[i] = possibleAlleles[i][c[i]];
            }

            retv.push(new Genome(genes));

            var i = c.length - 1;
            while (i >= 0) {
                c[i]++;
                if (c[i] >= possibleAlleles[i].length) {
                    for (var j = i; j < c.length; j++) {
                        c[j] = 0;
                    }
                    i--;
                } else {
                    break;
                }
            }
            if (i < 0) {
                break;
            }
        }

        return retv;
    }
}

class ArrayCombinationIterator {
    constructor(list, minListSize, maxListSize) {
        this.list = list;
        this.minListSize = minListSize;
        this.maxListSize = maxListSize;
        this.indexes = null;
        this.moveIndex = 0;
    }

    next() {
        if (this.indexes == null) {
            this.indexes = [];
            this.indexes.length = this.minListSize;
            for (var i = 0; i < this.indexes.length; i++) {
                this.indexes[i] = i;
            }
            this.moveIndex = this.indexes.length - 1;
        } else {
            var x = false;

            if (this.moveIndex == this.indexes.length - 1) {
                if (this.indexes[this.moveIndex] < this.list.length - 1) {
                    x = true;
                }
            } else if (this.indexes[this.moveIndex] + 1 < this.indexes[this.moveIndex + 1]) {
                x = true;
            }

            if (x) {
                this.indexes[this.moveIndex]++;
            } else {
                while (this.moveIndex >= 0 && this.indexes.length - this.moveIndex == this.list.length - this.indexes[this.moveIndex]) {
                    this.moveIndex--;
                }

                if (this.moveIndex == -1) {
                    if (this.indexes.length < this.maxListSize && this.indexes.length < this.list.length) {
                        this.indexes.push(0);
                        for (var i = 0; i < this.indexes.length; i++) {
                            this.indexes[i] = i;
                        }
                        this.moveIndex = this.indexes.length - 1;
                    } else {
                        return null;
                    }
                } else {
                    this.indexes[this.moveIndex]++;
                    for (var i = this.moveIndex + 1; i < this.indexes.length; i++) {
                        this.indexes[i] = this.indexes[i - 1] + 1;
                    }
                    this.moveIndex = this.indexes.length - 1;
                }
            }
        }

        var retv = [];
        this.indexes.forEach(element => {
            retv.push(this.list[element]);
        });
        return retv;
    }
}

var alleleMixin = Vue.mixin({
    methods: {
        isPositive(a) {
            return isPositiveAllele(a);
        },
        getAlleleText(a) {
            return Allele[a];
        }
    }
});

Vue.component('allele', {
    mixins: [alleleMixin],
    props: ["allele"],
    template: '<span v-bind:class="{ allele: true, \'allele-red\': !isPositive(allele), \'allele-green\': isPositive(allele) }">{{ getAlleleText(allele) }}</span>'
});

Vue.component('genome', {
    props: ["genome", "removable"],
    template: '<span class="genome"><allele v-for="(a, index) in genome.genes" v-bind:allele="a" :key="index"></allele> <button v-if="removable">Remove</button></span>'
});

(function () {
    var app = new Vue({
        el: "#app",
        data: {
            cloneInput: "",
            targetInput: "",
            targetGenome: null,
            clones: [],
            breedingSet: null,
            possibles: [],
            cancel: false,
            busy: false,
            busyNumber: 0
        },
        methods: {
            checkGenomeInput(s) {
                s = s.replace(/[^GHWXY]/gi, '').toUpperCase();
                if (s.length > 6) {
                    s = s.substring(0, 6);
                }
                return s;
            },
            checkCloneInput() {
                this.cloneInput = this.checkGenomeInput(this.cloneInput);
            },
            checkTargetInput() {
                this.targetInput = this.checkGenomeInput(this.targetInput);
            },
            addClone() {
                if (this.cloneInput.length == 6) {
                    for (var i = 0; i < this.clones.length; i++) {
                        if (this.clones[i].text == this.cloneInput) {
                            return;
                        }
                    }
                    this.clones.push({
                        text: this.cloneInput,
                        genome: parseGenome(this.cloneInput)
                    });
                    this.cloneInput = "";
                }
            },
            removeClone(text) {
                for (var i = 0; i < this.clones.length; i++) {
                    if (this.clones[i].text == text) {
                        this.clones.splice(i, 1);
                        break;
                    }
                }
            },
            calculate() {
                this.targetGenome = parseGenome(this.targetInput);
                var genomes = [];
                this.clones.forEach(c => {
                    genomes.push(c.genome);
                });

                var it = new ArrayCombinationIterator(genomes, 3, 9);

                var bh = {
                    best: new BreedingSet([genomes[0]]),
                    bestPossibles: 1,
                    bestMatch: 0
                };

                var tv = this;

                var func = function(){
                    var l = null;

                    if (!tv.cancel){
                        l = it.next();
                    }

                    if (l == null){
                        tv.busy = false;
                        tv.breedingSet = bh.best;
                        tv.possibles = bh.best.getPossibleResults();
                        return;
                    }

                    for (var i = 0; i < l.length; i++) {
                        var sl = [];
            
                        l.forEach(x => {
                            sl.push(x);
                        });
            
                        sl.splice(i, 1);
                        sl.unshift(l[i]);
            
                        var nbs = new BreedingSet(sl);
            
                        var results = nbs.getPossibleResults();
            
                        results.forEach(r => {
                            var nm = r.getNumberOfMatchingAllelesInAnyPosition(tv.targetGenome);
                            if (nm > bh.bestMatch) {
                                bh.best = nbs;
                                bh.bestMatch = nm;
                                bh.bestPossibles = results.length;
                            } else if (nm == bh.bestMatch) {
                                if (results.length < bh.bestPossibles) {
                                    bh.best = nbs;
                                    bh.bestPossibles = results.length;
                                } else if (results.length == bh.bestPossibles && nbs.genomes.length < bh.best.genomes.length) {
                                    bh.best = nbs;
                                }
                            }

                            if (bh.best === nbs){
                                tv.breedingSet = nbs;
                                tv.possibles = results;
                            }
                        });
                    }

                    tv.busyNumber++;

                    window.setTimeout(func);
                };

                this.breedingSet = null;
                this.possibles = [];
                this.busyNumber = 0;
                this.cancel = false;
                this.busy = true;
                window.setTimeout(func);
            },
            getModifierGenomes() {
                return this.breedingSet.genomes.slice(1);
            }
        }
    });
})();