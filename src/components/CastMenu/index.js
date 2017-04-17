import React, { PureComponent, PropTypes } from 'react'
import css from 'classnames'
import './index.sass'
import '../../assets/style.css'

export default class CastMenu extends PureComponent {
  static propTypes = {
    source: PropTypes.shape(),
    handleClose: PropTypes.func,
    handleCast: PropTypes.func,
    handleStopCast: PropTypes.func,
    devices: PropTypes.array,
    selectedDevice: PropTypes.shape()
  }
  renderPlayerControls () {
    return (
      <div className='device-controls'>
        <button
          className='button stop'
          onClick={() => this.props.handleStopCast()}>
          STOP CASTING
        </button>
      </div>
    )
  }
  render () {
    let selectedName = ''
    if (this.props.selectedDevice && this.props.selectedDevice.name) {
      selectedName = this.props.selectedDevice.name
    }
    let searchMessage
    if (this.props.devices.length === 0) {
      searchMessage = (
        <div className='flex-wrapper'>
          <i className='search-icon icon-radio-tower' />
          <p> Searching for devices... </p>
        </div>
      )
    }
    return (
      <div className={css('modal-component cast-menu-component', {
        searching: this.props.devices.length === 0
      })}>
        <div className='close button' onClick={() => this.props.handleClose()}> X </div>
        { searchMessage }
        {
          this.props.devices.map((device, index) => {
            return (
              <div className='device' key={device.host}>
                <div className='info'>
                  <div> Name: {device.name} </div>
                  <div> IP: {device.host} </div>
                </div>
                <button
                  onClick={() => this.props.handleCast(index)}
                  className={css('button cast', {
                    active: selectedName === device.name
                  })}>
                  CAST
                </button>
              </div>
            )
          })
        }
        { selectedName ? this.renderPlayerControls() : null }
      </div>
    )
  }
}
