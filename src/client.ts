import IDragon, { convertToD } from "./entities/dragon";

const BASE_URL = 'http://192.168.0.141:3000/dragon';

export async function getAll() {
    const res = await fetch(BASE_URL, {
        method: "GET"
    });

    return res.json();
}

export async function addDragon(dragon: IDragon) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(convertToD(dragon))
    })

    return res.json();
}

export async function deleteDragon(id: number, name: string) {
    const deleteUrl = BASE_URL + '?Name=' + name;
    const res = await fetch(deleteUrl, {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({Identifier: id})
    })

    return res.json();
}

export async function updateDragon(dragon: IDragon) {
    const updateUrl = BASE_URL + '?Name=' + dragon.name;
    const DDragon = convertToD(dragon);
    const res = await fetch(updateUrl, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            Identifier: DDragon.entityID,
            ...DDragon,
        })
    })
}