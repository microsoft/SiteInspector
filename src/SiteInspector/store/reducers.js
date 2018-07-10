import { combineReducers } from 'redux';
import { reducer as ReduxFormReducer } from 'redux-form';
import ShellReducer from '../views/Shell/reducer';
import SharedReducer from '../shared/reducer';
import BugViewerReducer from '../views/Bugs/reducer';
import ScriptViewerReducer from '../views/Scripts/reducer';
import ContactViewerReducer from '../views/Contact/reducer';

export default function createMainReducer(asyncReducers) {
  return combineReducers({
    ShellState: ShellReducer,
    SharedState: SharedReducer,
    BugViewerState: BugViewerReducer,
    ScriptViewerState: ScriptViewerReducer,
    ContactViewerState: ContactViewerReducer,
    form: ReduxFormReducer,
    ...asyncReducers,
  });
}
