import React from 'react'
import { Field } from 'formik';
import isEqual from 'react-fast-compare'

class FieldGroup extends React.Component {
  constructor(props) {
    super(props)
    this.form = props.form
    this.state = {
      /*
        * Create a watched fields object for this group based on
        * initial static related fields and other dynamically related fields
        * in order to reduce re-renders and speed up large forms.
      */
      watched: props.fields.map(field => {
        let f = {
          ...field,
          _show: this.isVisible(field).toString(),
          _value: this.form.values[field.name]
        }
        if(field.watch) {
          let watched = {}
          field.watch.forEach(f => { watched[f] = this.form.values[f] })
          f['_watch'] = watched
        }
        return f
      })
    }
  }

  componentDidUpdate(prevProps) {
    let newwatched = this.props.fields.map(field => {
      let f = {
        ...field,
        _show: this.isVisible(field).toString(),
        _value: this.props.form.values[field.name] ? this.props.form.values[field.name] : ''
      }
      if(field.watch) {
        let watched = {}
        field.watch.forEach(fo => { watched[fo] = this.props.form.values[fo] })
        f['_watch'] = watched
      }
      return f
    })
    if (!isEqual(this.state.watched, newwatched)) { this.setState({ watched: newwatched }) }
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.form = nextProps.form
    let newwatched = nextProps.fields.map(field => {
      let f = {
        ...field,
        _show: this.isVisible(field).toString(),
        _value: nextProps.form.values[field.name] ? nextProps.form.values[field.name] : ''
      }
      if(field.watch) {
        let watched = {}
        field.watch.forEach(f => { watched[f] = nextProps.form.values[f] })
        f['_watch'] = watched
      }
      return f
    })
    if (isEqual(this.state.watched, newwatched)) { return false } // Only re-render group if our watch has changed
    return true
  }

  isVisible = field => {
    let show = false
    if (field.show) { // Dependency exists
      Object.keys(field.show).forEach( requiredfield => {
        if (Array.isArray(field.show[requiredfield])) {
          field.show[requiredfield].forEach( fieldvalue => {
            if (this.form.values[requiredfield] === fieldvalue) { show = true }
          })
        } else {
          if (this.form.values[requiredfield] === field.show[requiredfield]) {
            show = true
          }
        }
      } )
    } else {
      show = true
    }
    return show
  }

  renderInput = field => {
    let input
    switch (field.type) {
      case 'select':
        let options = field.options.map( option => (
          React.createElement('option', { key: `${field.name}-${option.value}`, value: option.value }, option.label)
        ))
        options.unshift(React.createElement('option',{ key: 'default'} ))
        input = React.createElement(Field, { key: field.name, component: 'select', ...field }, [...options])
        break
      default:
        input = React.createElement(Field, { key: field.name, ...field })
        break
    }
    return input
  }

  render() {
    console.log('Rendering ' + this.props.groupname)
    return (
      <div className="fieldgroup">
        <h3>{this.props.groupname}</h3>
        { this.props.fields.map(field => {
          if (this.isVisible(field)) {
            return (
              <div key={`fc-${field.name}`} className={`fieldcomponent ${field.type}`}>
                <label>{field.label}</label>
                { this.renderInput(field) }
              </div>
            )
          }
          return null
          })
        }
      </div>
    )
  }

}

export default FieldGroup