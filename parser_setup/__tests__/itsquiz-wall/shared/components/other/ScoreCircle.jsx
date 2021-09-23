 /* eslint
    no-param-reassign: 0
*/

import React, { Component, PropTypes } from 'react';

import ProgressBar from 'progressbar.js';
import ColorUtil   from '../../utils/ColorUtil';

import './ScoreCircle.less';

const RED = '#F71D1D';
const ORANGE = '#EAB42C';
const GREEN = '#47D62A';
const PURPLE = '#00bcd4';

class ScoreCircle extends Component {
    static propTypes = {
        value : PropTypes.number,
        size  : PropTypes.number
    };

    componentWillMount() {
        this.id = Date.now();
    }

    componentDidMount() {
        this.colorUtil = new ColorUtil([RED, ORANGE, GREEN]);
        const { value } = this.props;

        this.scoreColor = '#FFF' || this.colorUtil.getColorCodeByPercent(value ? value : 0);

        this.circle =  new ProgressBar.Circle(`#score-${this.id}`, {
            color: '#FCB03C',
            strokeWidth: 3,
            trailWidth: 1,
            duration: 1500,
            text: {
                value: `${value}%`,
                color: this.scoreColor
            },
            step: (state, shape) => {
                shape.path.setAttribute('stroke', state.color);
                shape.setText(`${(shape.value() * 100).toFixed(0)}%`);
                shape.text.style.color = state.color;
            }
        });

        this.circle.animate(value / 100, {
            from: { color: PURPLE },
            to: { color: this.scoreColor }
        });
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.value !== this.props.value;
    }

    componentDidUpdate() {
        const { value } = this.props;
        const prevScoreColor = this.scoreColor;

        this.scoreColor = this.colorUtil.getColorCodeByPercent(value ? value : 0);

        this.circle.animate(value / 100, {
            from : { color: prevScoreColor },
            to   : { color: this.scoreColor }
        });
    }

    componentWillUnmount() {
        this.circle = null;
    }

    render() {
        const { size } = this.props;

        const style = {
            width    : size,
            height   : size,
            fontSize : size / 3
        };

        return (
            <div
                className='ScoreCircle'
                id={`score-${this.id}`}
                style={style}
            />
        );
    }
}

export default ScoreCircle;
