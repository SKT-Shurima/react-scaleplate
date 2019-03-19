import React, { Component } from 'react';
import styles from './index.less';

export default class Scaleplate extends Component {
  static defaultProps = {
    width: 800,
    height: 800,
    axisMargin: 0,
    axisOrigin: { x: 16, y: 16 },
    axisLineWidth: 0.5,
    tickWidth: 20,
    ticksLineWidth: 0.5,
    horizontalTickSpacing: 10,
    verticalTickSpacing: 10
  };

  componentDidMount() {
    this.context = this.scaleplate.getContext('2d');
    this.initDraw(this.props);
  }

  shouldComponentUpdate() {
    return false;
  }


  initDraw = (props) => {
    this.axisMargin = props.axisMargin;
    this.axisOrigin = {
      x: this.axisMargin + props.axisOrigin.x,
      y: (props.height - this.axisMargin) + props.axisOrigin.y + 16
    };
    this.axisTop = this.axisMargin;
    this.axisRight = props.width - this.axisMargin;
    this.horizontalTickSpacing = props.horizontalTickSpacing;
    this.verticalTickSpacing = props.verticalTickSpacing;
    this.axisWidth = (this.axisRight - this.axisOrigin.x) + 16;
    this.axisHeight = (this.axisOrigin.y - this.axisTop) + 16;
    this.numVerticalTicks = this.axisHeight / this.verticalTickSpacing;
    this.numHorizonticalTicks = this.axisWidth / this.horizontalTickSpacing;
    this.tickWidth = props.tickWidth;
    this.ticksLineWidth = props.ticksLineWidth;
    this.axisLineWidth = props.axisLineWidth;
    this.drawAxes();
  }
  drawAxes = () => {
    this.context.save();
    this.context.font = '9px sans-serif';
    this.context.fillStyle = '#fff';
    this.context.fillRect(0, 0, this.axisRight + 16, 16);
    this.context.fillRect(0, 0, 16, this.axisHeight);
    this.context.stroke();
    this.context.fillStyle = '#666';
    this.drawHorizontalAxis();
    this.drawVerticalAxis();
    this.context.lineWidth = 0.5;
    this.context.lineWidth = this.ticksLineWidth;
    this.drawVerticalAxisTicks();
    this.drawHorizontalAxisTicks();
    this.drawVerticalText();
    this.context.restore();
  }

  // 绘制横向标尺轴
  drawHorizontalAxis = () => {
    this.context.beginPath();
    this.context.moveTo(16, 16);
    this.context.lineTo(this.axisRight + 16, this.axisMargin + 16); // +16 纵向向下偏移16px
    this.context.closePath();
    this.context.stroke();
  }

  // 绘制纵向标尺轴
  drawVerticalAxis = () => {
    this.context.beginPath();
    this.context.moveTo(16, 16);
    this.context.lineTo(16, this.axisOrigin.y); // +16 横向向右偏移16px
    this.context.closePath();
    this.context.stroke();
  }

  // 绘制纵向刻度
  drawVerticalAxisTicks = () => {
    let deltaX;
    this.context.translate(16, 16);
    for (let i = 1; i < this.numVerticalTicks; i += 1) {
      this.context.beginPath();
      if (i % 10 === 0) {
        deltaX = this.tickWidth;
        this.context.moveTo(this.axisOrigin.x - 32, i * this.verticalTickSpacing);
        this.context.lineTo((this.axisOrigin.x + deltaX) - 36, i * this.verticalTickSpacing);
      } else if (i % 5 === 0) {
        deltaX = (this.tickWidth * 2) / 3; // 控制50倍数短线的长度
        this.context.moveTo(this.axisOrigin.x - 28, i * this.verticalTickSpacing);
        this.context.lineTo((this.axisOrigin.x + deltaX) - 28, i * this.verticalTickSpacing);
      } else {
        deltaX = this.tickWidth / 3; // 控制小刻度的长度
        this.context.moveTo(this.axisOrigin.x - 24, i * this.verticalTickSpacing);
        this.context.lineTo((this.axisOrigin.x + deltaX) - 24, i * this.verticalTickSpacing);
      }
      this.context.save();
      this.context.stroke();
    }
  }

  // 绘制纵向文字
  drawVerticalText = () => {
    const { x, y } = this.props.axisOrigin;
    this.context.translate(x, y);
    this.context.textAlign = 'right';
    this.context.rotate((3 * Math.PI) / 2);
    for (let i = 0; i < this.numVerticalTicks; i += 5) {
      this.context.fillText(i * 10, (-i * 10) + 16, -20);
    }
  }

  // 绘制横向刻度+文字
  drawHorizontalAxisTicks = () => {
    let deltaY;
    for (let i = 0; i < this.numHorizonticalTicks; i += 1) {
      this.context.beginPath();
      if (i % 10 === 0 && i !== 0) {
        deltaY = this.tickWidth;
        this.context.moveTo(i * this.horizontalTickSpacing, this.axisMargin);
        this.context.lineTo(i * this.horizontalTickSpacing, -(this.axisMargin + deltaY));
        this.context.textAlign = 'left';
        this.context.fillText(i * this.verticalTickSpacing, this.verticalTickSpacing * i, -6);
      } else if (i % 5 === 0) {
        deltaY = (this.tickWidth * 2) / 3;
        this.context.moveTo(i * this.horizontalTickSpacing, this.axisMargin);
        this.context.lineTo(i * this.horizontalTickSpacing, -(this.axisMargin + deltaY));
        this.context.textAlign = 'left';
        this.context.fillText(i * this.verticalTickSpacing, this.verticalTickSpacing * i, -6);
      } else {
        deltaY = this.tickWidth / 3;
        this.context.moveTo(i * this.horizontalTickSpacing, this.axisMargin);
        this.context.lineTo(i * this.horizontalTickSpacing, -(this.axisMargin + deltaY));
      }
      this.context.save();
      this.context.stroke();
    }
  }

  render() {
    return (
      <canvas
        className={styles.scaleplate}
        ref={(el) => { this.scaleplate = el; }}
        width={this.props.width + 16}
        height={this.props.height + 16}
      />
    );
  }
}
