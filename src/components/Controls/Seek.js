import React, { Component, PropTypes } from 'react'

export default class Seek extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: 0
    }
  }
  static propTypes = {
    duration: PropTypes.number,
    current: PropTypes.number,
    handleRange: PropTypes.func
  }
  handleRange (e) {
    const value = this.props.duration * (e.target.value * .01)
    this.props.handleRange(value)
  }
  render () {
    const { current, duration } = this.props
    const value = current * 100 / duration

    return (
      <div className='seek-component'>
        <input
          className='seek-range'
          type='range'
          value={value}
          onChange={(e) => this.handleRange(e)}
        />
      </div>
    )
  }
}
