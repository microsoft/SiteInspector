import {
  TOGGLE_SHELL,
  SET_SHELL_PANEL_POSITION,
  REGISTER_TAB,
  SET_CURRENT_PATH,
  RESET_ROUTE_UPDATE,
} from './actions';
import routes from '../../router/routes';
import config from '../../shared/config';

export const initialState = {
  currentPath: '',
  activeState: '',
  position: 'right',
  tabs: [],
  visible: false,
  routesUpdated: false,
};

const ShellReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_SHELL: {
      return Object.assign({}, state, { visible: !state.visible });
    }
    case SET_SHELL_PANEL_POSITION: {
      return { ...state, position: action.position };
    }
    case RESET_ROUTE_UPDATE:
      {
        return { ...state, routesUpdated: false };
      }
    case SET_CURRENT_PATH: {
      let targetRoute;
      if (action.path) {
        targetRoute = routes.find(route => route.path === action.path);
      }
      return {
        ...state,
        currentPath: action.path,
        activeState: (targetRoute && targetRoute.state) || state.activeState,
      };
    }
    case REGISTER_TAB: {
      let routesUpdated = false;
      let targetRoute;

      if (action.tab) {
        targetRoute = routes.find(route =>
          route.id.toUpperCase() === action.tab.id.toUpperCase());

        if (targetRoute) {
          targetRoute.label = action.tab.title || targetRoute.label;
        } else {
          routes.push({
            id: action.tab.id,
            label: action.tab.label,
            path: `/${action.tab.id.toLowerCase()}`,
            component: action.tab.component,
            state: (action.tab.reducerMap &&
                Object.keys(action.tab.reducerMap).length &&
                Object.keys(action.tab.reducerMap)[0]) || '',
          });
          routesUpdated = true;
        }
      }

      const tabs = state.tabs.indexOf(action.tab.id) === -1
          ? [...state.tabs, action.tab.id]
          : state.tabs.slice(0);

      return { ...state,
        tabs: config.tabs.map(tab => tab.id).filter(tab => tabs.indexOf(tab) !== -1),
        routesUpdated,
      };
    }
    default:
      return state;
  }
};

export default ShellReducer;
