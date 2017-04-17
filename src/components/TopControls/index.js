import React, { PureComponent, PropTypes } from 'react'
import css from 'classnames'
import './index.sass'
import '../../assets/style.css'

export default class TopControls extends PureComponent {
  static propTypes = {
    // duration: PropTypes.number.isRequired,
    // current: PropTypes.number.isRequired,
    active: PropTypes.bool,
    source: PropTypes.shape(),
    handleCastMenu: PropTypes.func
    // isPlaying: PropTypes.bool,
    // handleToggle: PropTypes.func,
    // stepBackward: PropTypes.func,
    // stepForward: PropTypes.func,
    // handleRange: PropTypes.func
  }
  handleCast () {

  }
  render () {
    return (
      <div className={css('top-controls-component', { active: this.props.active })}>
        <div> {this.props.source.path} </div>
        <i className='icon-cast' onClick={() => this.props.handleCastMenu()} />
      </div>
    )
  }
}
