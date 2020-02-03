import {EventActions} from "@drizzle/store";
import { toast } from 'react-toastify'
const EventNotifier = store => next => action => {

    if (action.type === EventActions.EVENT_FIRED) {
        const eventName = action.event.event;
        let display ='';
        let refresh = false;
        if (eventName === 'LogPrediction'){
            const newVal = action.event.returnValues.modelVersion;
            refresh= true;
            display = `Successfully added new prediction for model version: ${newVal}`
        }
        if (eventName === 'LogCashOut'){
            refresh= false;
            const newVal = action.event.returnValues.balance;
            display = `Successfully cashed out the model funds: ${newVal} WEI`;
        }      
        
        toast.success(display, { position: toast.POSITION.TOP_RIGHT });
        if (refresh){
            window.location.reload();
        }       
    }
    return next(action);
}

export default EventNotifier;