import path from 'path'
import React, { PureComponent, PropTypes } from 'react'
import { BrowserWindow, remote } from 'electron'
import Controls from '../Controls'
import TopControls from '../TopControls'
import CastMenu from '../CastMenu'
import './index.sass'

const electron = remote.getCurrentWindow()
const chromecasts = electron.chromecasts

const IDLE_TIMER = 2000
const UPDATE_TIMER = 500

export default class Player extends PureComponent {
  constructor () {
    super()
    this.state = {
      current: 0,
      duration: 0,
      active: false,
      isPlaying: true,
      fullscreen: false,
      castMenu: false,
      devices: [],
      selectedDevice: null,
      sources: []
    }
  }
  componentDidMount () {
    console.log(electron.argv)
    if (electron.argv[1] || electron.argv[2]) {
      this.setState({
        sources: [{ path: electron.argv[2] || electron.argv[1] }]
      })
    }
    window.addEventListener('mousemove', this.startIdle.bind(this))
    window.addEventListener('mousedown', this.startIdle.bind(this))
    window.addEventListener('mouseup', this.startIdle.bind(this))
    window.addEventListener('keyup', (e) => {
      this.startIdle()
      if (e.keyCode === 27) {
        electron.setFullScreen(false)
      }
      if (!this.video) return
      if (e.keyCode === 32) {
        e.stopPropagation()
        e.preventDefault()
        if (this.state.isPlaying === false) {
          this.video.play()
          this.setState({ isPlaying: true })
          return false
        }
        this.video.pause()
        this.setState({ isPlaying: false })
        return false
      }
    })
  }
  componentWillUnmount () {
    window.removeEventListener('mousemove', () => {})
    if (!this.interval) return
    clearInterval(this.interval)
  }
  startIdle () {
    this.setState({ active: true })
    clearTimeout(this.idleTimer)

    this.idleTimer = setTimeout(() => {
      this.setState({ active: false })
    }, IDLE_TIMER)
  }
  initCasts () {
    chromecasts.devices((devices) => {
      this.setState({ devices })
    })
  }
  handleStopCast () {
    if (!this.state.selectedDevice) return
    this.state.selectedDevice.stop()
    this.setState({
      selectedDevice: null
    })
    if (this.server) {
      this.server.close()
      this.server = null
    }
  }
  handleCast (index) {
    const device = this.state.devices[index]
    if (!device) return
    if (this.server) return this.handleStopCast()
    this.setState({
      selectedDevice: device
    })
    const file = path.basename(this.state.sources[0].path)
    const dirname = path.dirname(this.state.sources[0].path)
    const url = 'http://192.168.0.18:3001' + '/' + file
    this.server = chromecasts.serve(dirname)
    device.play(url)
    this.video.pause()
  }
  handleVideoRef (el) {
    this.video = el
  }
  handleVideoLoad () {
    this.video.play()
    this.setState({ duration: this.video.duration })
    this.interval = setInterval(() => {
      if (!this.video) return clearInterval(this.interval)
      this.setState({ current: this.video.currentTime })
    }, UPDATE_TIMER)
  }
  handleDoubleClick () {
    const fullscreen = !this.state.fullscreen
    electron.setFullScreen(fullscreen)
    this.setState({ fullscreen })
  }
  handleToggle () {
    this.setState({ isPlaying: !this.state.isPlaying })
    if (!this.video) return
    if (this.video.paused) return this.video.play()
    this.video.pause()
  }
  stepBackward () {
    if (!this.video) return
    this.video.currentTime = this.video.currentTime - 10
  }
  stepForward () {
    if (!this.video) return
    this.video.currentTime = this.video.currentTime + 10
  }
  handleRange (value) {
    if (!this.video) return
    this.video.currentTime = value
  }
  handleCastMenu () {
    this.setState({ castMenu: !this.state.castMenu })
    this.initCasts()
  }
  handleInitialClick () {
    const dialog = remote.dialog.showOpenDialog({
      properties: [ 'openFile' ]
    })
    if (!dialog || !dialog[0]) return

    this.setState({
      sources: [{ path: dialog[0] }]
    })
  }
  render () {
    const source = this.state.sources[0] || {}
    let castMenu
    if (this.state.castMenu) {
      castMenu = (
        <CastMenu
          handleCast={(e) => this.handleCast(e)}
          handleClose={() => this.handleCastMenu()}
          handleStopCast={() => this.handleStopCast()}
          devices={this.state.devices}
          selectedDevice={this.state.selectedDevice}
          source={source}/>
      )
    }
    let videoElement
    if (source.path) {
      videoElement = (
        <video
          ref={(el) => this.handleVideoRef(el)}
          onLoadedMetadata={() => this.handleVideoLoad()}
          onDoubleClick={() => this.handleDoubleClick()}
          className='video-element'
          src={path.resolve(source.path)} />
      )
    }
    if (!source.path) {
      videoElement = (
        <div className='backdrop'
          onClick={() => this.handleInitialClick()}>
          <img src='logo.png' className='logo-loader' />
        </div>
      )
    }
    return (
      <div className='player-component'>
        <TopControls
          handleCastMenu={() => this.handleCastMenu()}
          source={source}
          active={this.state.active} />
        {castMenu}
        {videoElement}
        <Controls
          isPlaying={this.state.isPlaying}
          active={this.state.active}
          duration={this.state.duration}
          handleToggle={() => this.handleToggle()}
          stepBackward={() => this.stepBackward()}
          stepForward={() => this.stepForward()}
          handleRange={(e) => this.handleRange(e)}
          current={this.state.current} />
      </div>
    )
  }
}
