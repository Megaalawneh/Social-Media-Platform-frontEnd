'use client'
import CreateAccount from '../../../components/createAccount'
import {CreateProfileProvider} from '../../../Context/CreateProfileContext'
export default function page() {
  return (
    <CreateProfileProvider>
         <CreateAccount/>
    </CreateProfileProvider>
 
  )
}
