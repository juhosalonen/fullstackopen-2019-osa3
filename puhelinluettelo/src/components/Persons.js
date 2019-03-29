import React from 'react'

const RenderPersons = (props) => {
    const persons2 = props.persons.filter(person => (person.name.toUpperCase()).includes(props.newFilter.toUpperCase()))
    return persons2.map(person =>
        <div key={person.name}>
            {person.name} &nbsp;
            {person.number} &nbsp;
            <props.Button handleClick={() => {
                if (window.confirm(`Poistetaanko ${person.name}`)) {
                    return props.personService
                        .deletePerson(person.id)
                        .then(() => {
                            props.setMessage(
                                `${person.name} poistettu`
                            )
                            setTimeout(() => {
                                props.setMessage(null)
                            }, 5000)
                            return props.personService
                                .getAll()
                                .then(response => {
                                    props.setPersons(response.data);
                                });
                        }
                        )
                        .catch(error => {
                            props.setErrorMessage(
                                `${person.name} on jo poistettu`
                            )
                            setTimeout(() => {
                                props.setErrorMessage(null)
                            }, 5000)
                        });
                }
            }
            }
                text={"delete"} />
        </div>)
}

export default RenderPersons