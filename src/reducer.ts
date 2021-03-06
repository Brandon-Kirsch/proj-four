import IDragon from "./entities/dragon";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAll, addDragon, deleteDragon } from "./client";

const initialState = {
    dragons: [{
      id: -1,
      name: 'Null',
      origin: 'Null',
      style: 'Western',
      wings: 2,
      legs: 2,
      weight: 10,
      length: 10,
      flight: false,
      magical: false,
    }],
    state: 'idle',
    error: null,
    selectedId: -1,
    sort: {
      key: 'id',
      ascending: true
    }
}

export async function getAllDragons(dispatch, getState) {
    dispatch({ type: 'store/load' });
    const response = await getAll();
    const res = [...response.Items];
    let dragons: [IDragon?] = [];
    for (let d of res) {
        const newDragon: IDragon = {
            id: d.entityID.N,
            name: d.Name.S,
            origin: d.Origin.S,
            style: d.Style.S,
            wings: d.Wings.N,
            legs: d.Legs.N,
            length: d['Length (Meters)'].N,
            weight: d['Weight (Kilos)'].N,
            flight: d.Flight.BOOL,
            magical: d.Magical.BOOL
        }
        dragons.push(newDragon);
    };
    console.log(dragons);
    dispatch({ type: 'dragons/getAllDragons', payload: dragons})
}

export const addOneDragon = createAsyncThunk(
  'dragons/addDragons',
  async (newDragon: IDragon) => {
    const response = await addDragon(newDragon);
    console.log(response);
    return newDragon;
  }
)

export const updateDragon = createAsyncThunk(
  'dragons/updateDragon',
  async (updatedDragon: IDragon) => {
    const response = await addDragon(updatedDragon);
    console.log(response);
    return updatedDragon;
  }
)

export const removeOneDragon = createAsyncThunk(
  'dragons/removeDragon',
  async (targetDragon: IDragon) => {
    const response = await deleteDragon(targetDragon.id, targetDragon.name);
    console.log(response);
    return targetDragon;
  }
)

  export function nextDragonId(dragons: IDragon[]): number {
    const maxId = dragons.reduce((maxId: number, dragon: IDragon) => Math.max(dragon.id, maxId), -1);
    if (isNaN(maxId)) {return 0};
    return maxId + 1;
}
  
  // Use the initialState as a default value
  export default function appReducer(state = initialState, action) {
    // The reducer normally looks at the action type field to decide what happens
    switch (action.type) {
      // Do something here based on the different types of actions
      case 'dragons/getAllDragons': {
        return {
            ...state,
            dragons: action.payload,
            state: 'idle',
        }
      }
      case 'dragons/addDragons': {
          const payload = action.payload;
          let drags = [];
          for (let d in payload.dragons) {
              const dragon = payload.dragons[d];
              dragon.id = +nextDragonId(state.dragons) + +d;
            drags.push(dragon);
          }
        // We need to return a new state object
        return {
          // that has all the existing state data
          ...state,
          // but has a new array for the `dragons` field
          dragons: [
            // with all of the old dragons
            ...state.dragons,
            // and the new dragon object(s)
            ...drags,
          ],
          state: 'idle'
        }
      }
      case 'dragons/removeDragon': {
        const targetId: number = action.payload.dragon.id;
        const targetName: string = action.payload.dragon.name;
        return {
          ...state,
          dragons: state.dragons.filter(({id, name}) => id != targetId && name != targetName)
        }
      }
      case 'dragons/updateDragon': {
        const targetId: number = action.payload.dragon.id;
        const targetName: string = action.payload.dragon.name;
        return {
          ...state,
          dragons: [
            state.dragons.filter(({id, name}) => id != targetId && name != targetName),
            action.payload.dragon,
          ]
        }
      }
      case 'store/load': {
          return {
              ...state,
              state: 'loading',
          }
      }
      case 'store/select': {
        return {
          ...state,
          selectedId: action.payload,
        }
      }
      case 'store/sort': {
        const payload = action.payload
        const newSort = state.sort;
        if (payload === newSort.key) {
          newSort.ascending = !newSort.ascending;
        } else {
          newSort.ascending = true;
          newSort.key = payload;
        }
        console.log(`Sorting by ${payload} ${newSort.ascending ? 'ascending' : 'descending'}`)
        switch (payload) {
          default:
            return {...state, sort: newSort, dragons: state.dragons.sort((a, b) => newSort.ascending ? a.id - b.id : b.id - a.id)}
          case 'name':
            return {...state, sort: newSort, dragons: state.dragons.sort((a, b) => newSort.ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name))}
        }
      }
      default:
        // If this reducer doesn't recognize the action type, or doesn't
        // care about this specific action, return the existing state unchanged
        return state
    }
  }

export const selectAllDragons = state => state.dragons;

export const selectByID = (state, id: number) => 
  state.dragons.find((dragon: IDragon) => dragon.id === id);