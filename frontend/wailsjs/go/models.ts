export namespace main {
	
	export class Developer {
	    id: string;
	    name: string;
	
	    static createFrom(source: any = {}) {
	        return new Developer(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	    }
	}
	export class Group {
	    id: string;
	    name: string;
	    members: string[];
	
	    static createFrom(source: any = {}) {
	        return new Group(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.members = source["members"];
	    }
	}

}

