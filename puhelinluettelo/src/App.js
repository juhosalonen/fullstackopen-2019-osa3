import React, { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Filter from './components/Filter'
import personService from './services/persons.js'
import Button from './components/Button'
import Notification from './components/Notification'
import Error from './components/Error'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }
  
  const addInfo = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    const IfSame = persons.filter(person => person.name === newName)
    if (IfSame.length !== 0) {
      if (window.confirm(`${newName} on jo luettelossa, korvataanko vanha numero uudella?`)) {
        personService
          .update(IfSame[0].id, personObject)
          .then(() => personService
            .getAll()
            .then(response => {
              setMessage(
                `${newName} päivitetty`
              )
              setTimeout(() => {
                setMessage(null)
              }, 5000)

              return setPersons(response.data);
            })
            .catch(error => {
              setErrorMessage(
                `${newName} tapahtui virhe`
              )
              setTimeout(() => {
                setErrorMessage(null)
              }, 5000)
            })
          );
      }
    }
    else {
      personService
        .create(personObject)
        .then(response => {
          setMessage(
            `${newName} lisätty`
          )
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          return setPersons(response.data)
        })
        .catch(error => {
          console.log('fail')
        })
    }
    setNewName('')
    setNewNumber('')
  }

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
      .catch(error => {
        console.log('fail')
      })
  }, [])

  return (
    <div>
      <h2>Puhelinluettelo</h2>
      <Notification message={message} />
      <Error errorMessage={errorMessage} />
      <Filter
        handleFilterChange={handleFilterChange}
        newFilter={newFilter}
      />
      <h3>lisää uusi</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        onSubmitFunction={addInfo}
      />
      <h2>Numerot</h2>
      <Persons
        persons={persons}
        newFilter={newFilter}
        personService={personService}
        setPersons={setPersons}
        Button={Button}
        setMessage={setMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  )
}

export default App