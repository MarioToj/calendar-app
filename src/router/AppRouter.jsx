import { useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { LoginPage } from '../auth'
import { CalendarPage } from '../calendar'
import { useAuthStore } from '../hooks'
import { LoadingRouter } from './LoadingRouter'


export const AppRouter = () => {


  const { status, checkAuthToken } = useAuthStore()
  // const authStatus = 'not-authenticated'

  useEffect(() => {
    checkAuthToken()
  }, [])
  

  if (status === 'checking') {
    return (
      <LoadingRouter />
    )
  }

  return (
    
    <Routes>
        {
          ( status === 'not-authenticated' ) 
          ?
        ( 
          <>
           <Route path='/auth/*' element={ <LoginPage /> }/>
          <Route path='/*' element={ <Navigate to='/auth/login'/> }/>
          </>
        )
          :
         ( 
         <>
          <Route path='/' element={ <CalendarPage /> }/>
          <Route path='/*' element={ <Navigate to='/'/> }/>
          </>)
        }

    </Routes>

  )
}
