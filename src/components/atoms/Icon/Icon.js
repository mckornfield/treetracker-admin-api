import React from 'react'
import { iconPaths } from '../../../common/iconPaths'
import { withStyles } from '@material-ui/core/styles'

const styles = (theme) => ({
  default: {
    fill: '#333'
  },
  active: {
    fill: '#fff'
  }
})

const Icon = (props) => ({

  render() {
    return (
        <svg width='36' height='36' viewBox='0 0 24 24'>
          <path className={(props.active) ? props.classes.active : props.classes.default } d={iconPaths[props.icon]}></path>
        </svg>
    )
  }
})
export default withStyles(styles)(Icon)
