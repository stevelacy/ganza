import React, { PureComponent, PropTypes } from 'react'
import css from 'classnames'
import formatTime from './formatTime'
import Seek from './Seek'
import './index.sass'
import '../../assets/style.css'

export default class Controls extends PureComponent {
  static propTypes = {
    duration: PropTypes.number.isRequired,
    current: PropTypes.number.isRequired,
    active: PropTypes.bool,
    isPlaying: PropTypes.bool,
    handleToggle: PropTypes.func,
    stepBackward: PropTypes.func,
    stepForward: PropTypes.func,
    handleRange: PropTypes.func
  }
  render () {
    const play = this.props.isPlaying
    const { current, duration } = this.props
    const value = current * 100 / duration
    return (
      <div className={css('controls-component', { active: this.props.active })}>
        <Seek {...this.props} />
        <div className='buttons'>
          <div className='time start'> {formatTime(current)} </div>
          <button
            onClick={() => this.props.stepBackward()}
            className='prev'>
            <i className='icon-backward2' />
          </button>
          <div className='spacer' />
          <button
            onClick={() => this.props.handleToggle()}
            className='play'>
            <i className={play ? 'icon-pause2' : 'icon-play3'} />
          </button>
          <div className='spacer' />
          <button
            onClick={() => this.props.stepForward()}
            className='next'>
            <i className='icon-forward3' />
          </button>
          <div className='time end'> {formatTime(duration)} </div>
        </div>
      </div>
    )
  }
}
