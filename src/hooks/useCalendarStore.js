import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import calendarApi from '../api/calendarApi'
import { convertEventstoDateEvents } from '../helpers'
import { onAddNewEvent, onSetActiveEvent, onUpdateEvent, onDeleteEvent, onLoadEvents } from '../store/calendar/calendarSlice'

export const useCalendarStore = () => {
  
    const dispatch = useDispatch()

    const { events, activeEvent } = useSelector( state => state.calendar )
    const { user } = useSelector( state => state.auth )

    const setActiveEvent = ( calendarEvent ) => {

      dispatch( onSetActiveEvent(calendarEvent) )
    }

    const startSavingEvent = async(calendarEvent) => {

      
      try {
        
        if (calendarEvent.id) {

          //Actaulizando
  
          await calendarApi.put(`/events/${ calendarEvent.id }`, calendarEvent)
  
          dispatch( onUpdateEvent({...calendarEvent, user} ) )
          return
        }
           //Creando
          const { data } = await calendarApi.post( '/events', calendarEvent )
          console.log({data});
  
          dispatch( onAddNewEvent( { ...calendarEvent, id: data.evento.id, user } ) )

      } catch (error) {
        console.log(error)
        Swal.fire( 'Error al guardar', error.response.data?.msg, 'error' )
      }

    }

    const startdeleteEvent = async() => {

        try {
          
          await calendarApi.delete(`/events/${activeEvent.id}`)
          dispatch( onDeleteEvent() )
        } catch (error) {
  
          console.log(error)
          Swal.fire( 'Error al eliminar', error.response.data?.msg, 'error' )
          }
    }

    const startLoadingEvents = async() => {

      try {
        
        const { data } = await calendarApi.get( '/events' )
        const events = convertEventstoDateEvents( data.eventos )
        dispatch( onLoadEvents(events) )

      } catch (error) {
        console.log('Error en la carga de eventos');
        console.log(error);
      }
    }
  
    return {
        //Propiedades
        activeEvent,
        events,
        hasEventSelected: !!activeEvent,

        //Metodos
        setActiveEvent,
        startSavingEvent,
        startdeleteEvent,
        startLoadingEvents,
  }
}
