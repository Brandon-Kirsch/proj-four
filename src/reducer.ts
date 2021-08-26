import IDragon from "./entities/dragon";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAll, addDragon } from "./client";
import store from "./redux/store";

const initialState = {
    dragons: [{
        id: -1,
        name: 'Null',
    }],
    state: 'idle',
    error: null,
    selectedId: -1,
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
    return response;
  }
)

  export function nextDragonId(dragons): number {
    const maxId = dragons.reduce((maxId, dragon) => Math.max(dragon.id, maxId), -1);
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
      default:
        // If this reducer doesn't recognize the action type, or doesn't
        // care about this specific action, return the existing state unchanged
        return state
    }
  }

export const selectAllDragons = state => state.dragons;

export const selectByID = (state, id) => 
  state.dragons.find(dragon => dragon.id === id);
