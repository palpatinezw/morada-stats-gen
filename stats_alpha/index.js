const cats = ['c', 'm', 'v', 'i', 's']
const infras = ['F', 'T', 'R', 'M', 'C']

class PopulationEngine {
    constructor(val, cnsts) {
        const defaultPs = {
            c:0,
            m:0,
            v:0,
            i:0,
            s:0,
            u:0,
        }
        const defaultks = {
            ph:1,
            pc:1,
            q:1,
            eq:1,
        }

        this.P = {
            ...defaultPs,
            ...val
        }
        this.k = {
            ...defaultks,
            ...cnsts
        }
        this.Q = {
            c:0,
            m:0,
            v:0,
            i:0,
            s:0,
        }
    }

    calc(H) {
        let dP = this.k.ph*H/this.P.u - this.k.pc
        if (dP == NaN) dP = 0
        this.P.u += dP

        for (let cat of cats) {
            let dQ = this.k.q/(Math.E**(this.k.eq*this.P[cat]))
            this.Q[cat] += dQ
        }
    }

    getP() {
        let sum = 0
        for (let cat of cats) {
            sum += this.P[cat]
        }
        sum += this.P.u
        return sum;
    }
}
class InfraEngine {
    constructor(val) {
        const defaultinfras = {
            F:1,
            T:1,
            R:1,
            M:1,
            C:1
        }
        
        for (let infra of infras) {
            this[infra] = val[infra]??defaultinfras[infra]
        }
    }
}
class DistributorEngine {
    constructor(val, cnsts) {
        const defaultks = {
            c:1,
            m:1,
            v:1,
            i:1,
            s:1,
        }


        if (this.validate(val)) {
            for (let cat of cats) {
                this[cat] = val[cat]
            }
        }
        
        this.k = {
            ...defaultks,
            ...cnsts
        }
    }

    validate(val) {
        let sum = 0;
        for (let cat of cats) {
            if (!val[cat] || val[cat] < 0 || val[cat] > 1) return false;
            sum += val[cat]
        }
        
        if (sum != 1) return false
        return true;
    }

    getEdis(E) {
        let ret = {}
        for (let cat of cats) {
            ret[cat] = this.k[cat] * E * this[cat];
        }
    }
}

class StatsEngine {
    constructor(res, pops, statuses, params, infra, dis, ks) {
        const defaultks = {
            he:1,
            hm:1,
            
            hee:1,
            hel:1,
            hez:1,
            hme:1,
            hml:1,
            hmz:1,

            zh:1,
            zc:1,
            zp:1,
            zd:1,

            ev:1,
            e:1,
            ee:1,

            x:{
                c:1,
                m:1,
                v:1,
                i:1, 
                s:1,
            }
        }
        if (typeof res !== 'object' || res == null) res = {} 
        if (typeof statuses !== 'object' || statuses == null) statuses = {} 
        if (typeof params !== 'object' || params == null) params = {} 

        this.resources = {
            Y: 1,
            E: 1, //Ej only calculated at each tick
            V: 1,
            I: 1,
            D: 0,
            S: 0,
            ...res,
        }
        this.pops = pops??(new PopulationEngine());
        this.statuses = {
            Hs: 0,
            Hm: 0,
            Z: 0,
            ...statuses
        }
        this.setH()
        this.params = {
            Lc: 0, 
            Lp: 0,
            ...params
        }
        this.infra = infra??(new InfraEngine());
        this.distributor = dis??(new DistributorEngine())
        this.k = {
            ...ks
        }

        this.setEdis()
    }

    setEdis = () => {this.edis = this.distributor.getEdis(this.resources.E)}

    g(a,b,c) {
        let num = a*b*c;
        let exp = -this.k.ge*(b-a/2)
        return (num/(1+(Math.E**exp)))
    }
    setH() {
        this.statuses.H = this.k.he*this.statuses.Hs + this.k.hm*this.statuses.Hm
    }

    calcStatus() {
        let dHe = this.k.hee*this.g(this.infra.C*this.infra.T, this.pops.c, this.edis.v) + this.k.hel*this.params.Lp - this.k.hez*this.statuses.Z
        let dHm = this.k.hme*this.g(this.infra.C             , this.pops.c, this.edis.c) + this.k.hml*this.params.Lc - this.k.hmz*this.statuses.Z
        this.statuses.He += dHe
        this.statuses.Hm += dHm
        this.setH()

        let dZ = this.k.zh*(-this.statuses.H)*(Math.abs(this.statuses.He-this.statuses.Hm)) +
                    this.k.zc*this.pops.getP()*this.params.Lc +
                    this.k.zp*this.params.Lp +
                    this.k.zd*this.resources.D 
        this.statuses.Z += dZ
    }

    calcE() {
        let dE = (this.k.ev/this.statuses.Z)*this.g(this.infra.T, this.pops.t, this.resources.V) -
                    this.k.e*this.popss.getP()/(Math.E**(this.k.ee*this.statuses.H))
        this.resources.E += dE
        this.setEdis()
    }

    calcRest() {
        let X = {}
        for (let cat of cats) {
            X[cat] = (this.k.x[cat]/this.statuses.Z)*this.g(this.infra.F, this.pops.P.v+this.pops.P.i, )
        }
    }
}