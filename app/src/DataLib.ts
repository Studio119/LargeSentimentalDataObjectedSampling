/*
* @Author: Antoine YANG 
* @Date: 2019-11-14 19:45:37 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-11-16 21:57:12
*/


export interface FileSet {
    origin: string;
    tree: string;
    gathering: string;
}

export declare namespace DataForm {
    export type Origin = Array<{
        id: string;
        lng: string;
        lat: string;
        words: string;
        day: string;
        city: string;
        sentiment: string;
    }>;

    export type Tree = {
        id: number;
        parent: Tree | null;
        children: Array<Tree>;
        containedpoint: Array<number>;
    };

    export type Gathering = Array<{
        x: number;
        y: number;
        id: number;
        value: number;
        leaf_id: number;
    }>;

    export type Sampled = {
        [id: string]: Array<number>;
    };
}

