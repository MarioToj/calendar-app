import { Calendar } from 'react-big-calendar'
import { localizer, getMessagesEs } from '../../helpers'
import 'react-big-calendar/lib/css/react-big-calendar.css'


import { NavBar, CalendarEventBox, CalendarModal, FabAddNew, FabDelete } from '../'
import { useEffect, useState } from 'react';
import { useUiStore, useCalendarStore, useAuthStore } from '../../hooks';

export const CalendarPage = () => {

  const { user } = useAuthStore()

  const { events, setActiveEvent, startLoadingEvents } = useCalendarStore()

  const { openDateModal } = useUiStore()
 
  const [lastView, setLastView] = useState(localStorage.getItem( 'lastView') || 'week' )

  const eventStyleGetter = ( event, start, end, isSelected ) => {

    const isMyEvent = ( user.uid === event.user._id ) || ( user.uid === event.user.uid )

    const style = {
      backgroundColor: isMyEvent ? '#347CF7' : '#465660' ,
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white'
    }

    return {
      style
    }

  }

  const onDoubleClick = (event) => {

    openDateModal()
  }

  const onSelected = (event) => {

    setActiveEvent(event)
  }

  const onViewChanged = (event) => {

    localStorage.setItem( 'lastView', event )
    setLastView( event )
  }

  useEffect(() => {
    
    startLoadingEvents()
  }, [])
  

  return (
    <>
      <NavBar />

      <Calendar
      culture='es'
      localizer={localizer}
      defaultView={ lastView }
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 'calc( 100vh - 80px )' }}
      messages={ getMessagesEs() }
      eventPropGetter={ eventStyleGetter }
      components={{
        event: CalendarEventBox
      }}
      onDoubleClickEvent={ onDoubleClick }
      onSelectEvent={ onSelected }
      onView={ onViewChanged }
    />

      <CalendarModal />
      <FabAddNew />
      <FabDelete />

    </>
  )
}
