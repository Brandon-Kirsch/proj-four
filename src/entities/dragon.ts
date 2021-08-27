export default interface IDragon {
    id: number,
    name: string,
    origin?: string,
    style?: string,
    wings?: number,
    legs?: number,
    length?: number,
    weight?: number,
    flight?: boolean,
    magical?: boolean
}

export interface DDragon {
    entityID: number,
    Name: string,
    Origin?: string,
    Style?: string,
    Wings?: number,
    Legs?: number,
    Length?: number,
    Weight?: number,
    Flight?: boolean,
    Magical?: boolean,
}

export function convertToD(dragon: IDragon) {
    let output: DDragon;
    output = {
        entityID: dragon.id,
        Name: dragon.name,
        Origin: dragon.origin,
        Style: dragon.style,
        Wings: dragon.wings,
        Legs: dragon.legs,
        Length: dragon.length,
        Weight: dragon.weight,
        Flight: dragon.flight,
        Magical: dragon.magical
    }

    return output;
}