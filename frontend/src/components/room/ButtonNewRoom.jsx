import React from 'react'
import { Link } from 'react-router-dom'

function ButtonNewRoom() {
  return (
    <Link to={"create/room"}>
        Crear Sala
    </Link>
  )
}

export default ButtonNewRoom