import React from 'react';
import { Animated, StyleSheet } from 'react-native';

interface Props {
  colors: string[];
  duration: number;
  index: number;
  size: number;
  bsize: number;
  left?: number;
  onAnimationComplete: () => void;
  containerWidth: number;
  containerHeight: number;
}

class Confetti extends React.Component<Props> {
  public static defaultProps = {
    duration: 6000,
    colors: [
      'rgb(242.2, 102, 68.8)',
      'rgb(255, 198.9, 91.8)',
      'rgb(122.4, 198.9, 163.2)',
      'rgb(76.5, 193.8, 216.7)',
      'rgb(147.9, 99.4, 140.2)',
    ],
    size: 1,
    bsize: 1,
  };

  private _yAnimation: Animated.Value;
  private _xAnimation: Animated.AnimatedInterpolation;
  private _rotateAnimation: Animated.AnimatedInterpolation;
  private _containerWidth?: number;
  private _containerHeight?: number;

  color: string;
  left: number;

  constructor(props: Props) {
    super(props);
    this._yAnimation = new Animated.Value(0);
    this.color = this.randomColor(this.props.colors);
    this._containerWidth = this.props.containerWidth;
    this._containerHeight = this.props.containerHeight;

    this.left = this.randomValue(0, this._containerWidth);
    let rotationOutput = this.randomValue(-220, 220) + 'deg';
    this._rotateAnimation = this._yAnimation.interpolate({
      inputRange: [0, this._containerHeight / 2, this._containerHeight],
      outputRange: ['0deg', rotationOutput, rotationOutput],
    });

    let xDistance = this.randomIntValue((this._containerWidth / 3) * -1, this._containerWidth / 3);
    this._xAnimation = this._yAnimation.interpolate({
      inputRange: [0, this._containerHeight],
      outputRange: [0, xDistance],
    });
  }

  componentDidMount() {
    let { duration, index } = this.props;
    Animated.timing(this._yAnimation, {
      duration: duration + this.randomIntValue(duration * 0.2, duration * -0.2),
      toValue: (this._containerHeight || 0) + 1.25,
      useNativeDriver: true,
    }).start(this.props.onAnimationComplete);
  }

  getTransformStyle() {
    return {
      transform: [
        { translateY: this._yAnimation },
        { translateX: this._xAnimation },
        { rotate: this._rotateAnimation },
      ],
    };
  }

  getConfettiStyle() {
    let { index, size, bsize } = this.props;
    const bigConfetti = {
      height: 5.5 * size,
      width: 11 * size,
      borderBottomLeftRadius: 5 * bsize,
      borderBottomRightRadius: 5 * bsize,
      borderTopLeftRadius: 2.6 * bsize,
      borderTopRightRadius: 2.6 * bsize,
    };
    const mediumConfetti = {
      height: 4.5 * size,
      width: 8 * size,
      borderBottomLeftRadius: 2.5 * bsize,
      borderBottomRightRadius: 2.5 * bsize,
      borderTopLeftRadius: 1.3 * bsize,
      borderTopRightRadius: 1.3 * bsize,
    };
    const smallConfetti = {
      height: 3.5 * size,
      width: 7 * size,
      borderBottomLeftRadius: 2.5 * bsize,
      borderBottomRightRadius: 2.5 * bsize,
      borderTopLeftRadius: 1.3 * bsize,
      borderTopRightRadius: 1.3 * bsize,
    };

    if (index % 5 === 0) {
      return smallConfetti;
    } else if (index % 4 === 0) {
      return mediumConfetti;
    } else {
      return bigConfetti;
    }
  }

  randomValue(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  randomIntValue(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  randomColor(colors: string[]) {
    return colors[this.randomIntValue(0, colors.length)];
  }

  render() {
    let { left, ...otherProps } = this.props;
    return (
      <Animated.View
        style={[
          styles.confetti,
          this.getConfettiStyle(),
          this.getTransformStyle(),
          { marginLeft: this.left, backgroundColor: this.color },
        ]}
        {...otherProps}
      />
    );
  }
}

const styles = StyleSheet.create({
  confetti: {
    position: 'absolute',
    marginTop: 0,
  },
});

export default Confetti;
