import React from 'react'
import { Formik, Form } from 'formik'

import FieldGroup from './FieldGroup'
import { form } from './config.json'
import './style.css'


class App extends React.Component {
  constructor(props) {
    super(props)
    // We need to initialise the controlled form values
    let i= {}
    form.fields.forEach( field => { i[field.name] = '' })
    this.state = { initvals: i }
  }

  render() {
    return(
      <div className="bigform">
        <Formik
          initialValues={this.state.initvals}
          validateOnChange={false}
          validateOnBlur={true}
          onSubmit={this.handleSubmit}
          render={ props => {
            this.form = props
            return (
              <Form>
                { form.fieldgroups.map( group => {
                  return (
                    <FieldGroup
                      key={`group-${group}`}
                      groupname={group}
                      fields={form.fields.filter(field => field.group === group)}
                      form={props}
                    />
                  )
                }) }
              </Form>
            )
          }}
        />
      </div>
    )
  }

}

export default App