import React from 'react';
import { Dimensions, LayoutChangeEvent, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Confetti from './confetti';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface Props {
  confettiCount: number;
  timeout: number;
  untilStopped: boolean;
  containerStyle?: ViewStyle;
  startOnLoad?: boolean;
  colors?: string[];
  size?: number;
  bsize?: number;
  duration?: number;
  left?: number;
  width?: number;
  height?: number;
}

interface State {
  confettis: { key: number }[];
  onComplete?: (() => void) | null;
  width: number;
  height: number;
}

class ConfettiView extends React.Component<Props, State> {
  public static defaultProps = {
    confettiCount: 100,
    timeout: 30,
    untilStopped: false,
  };

  confettiIndex: number;
  shouldStop: boolean;
  timeout?: NodeJS.Timeout;

  constructor(props: Props) {
    super(props);
    this.state = { confettis: [], width: this.props.width || windowWidth, height: this.props.height || windowHeight };
    this.confettiIndex = 0;
    this.shouldStop = false;
  }

  componentDidMount() {
    if (this.props.startOnLoad) {
      this.startConfetti();
    }
  }

  componentWillUnmount() {
    this.stopConfetti();

    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  startConfetti(onComplete?: () => void) {
    let { confettis } = this.state;
    let { confettiCount, timeout, untilStopped } = this.props;
    this.shouldStop = false;
    if (untilStopped || this.confettiIndex < confettiCount) {
      this.timeout = setTimeout(() => {
        if (this.shouldStop) {
          return;
        } else {
          confettis.push({ key: this.confettiIndex });
          this.confettiIndex++;
          this.setState({ confettis, onComplete });
          this.startConfetti();
        }
      }, timeout);
    }
  }

  removeConfetti(key: number) {
    let { confettis, onComplete } = this.state;
    let { confettiCount } = this.props;
    let index = confettis.findIndex((confetti) => {
      return confetti.key === key;
    });
    confettis.splice(index, 1);
    this.setState({ confettis });
    if (key === confettiCount - 1) {
      this.confettiIndex = 0;
    }
    if (confettis.length === 0 && onComplete && typeof onComplete === 'function') {
      onComplete();
    }
  }

  stopConfetti() {
    this.shouldStop = true;
    this.confettiIndex = 0;
    const { onComplete } = this.state;
    if (onComplete && typeof onComplete === 'function') {
      onComplete();
    }
    this.setState({ confettis: [], onComplete: null });
  }

  onLayout(event: LayoutChangeEvent) {
    const { width, height } = event.nativeEvent.layout;

    // Use props provided dimensions if they are present
    this.setState({
      width: this.props.width || width,
      height: this.props.height || height,
    });
  }

  render() {
    let { confettis } = this.state;
    return (
      <View style={[styles.container, this.props.containerStyle]} onLayout={(event) => this.onLayout(event)}>
        {confettis.map((confetti) => {
          return (
            <Confetti
              key={confetti.key}
              index={confetti.key}
              onAnimationComplete={this.removeConfetti.bind(this, confetti.key)}
              colors={this.props.colors}
              size={this.props.size}
              bsize={this.props.bsize}
              duration={this.props.duration}
              left={this.props.left}
              containerWidth={this.state.width}
              containerHeight={this.state.height}
            />
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});

export default ConfettiView;
