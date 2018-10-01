import React from 'react';
import { View } from 'react-native';
import QRCode from "react-native-qrcode";

const QR_SIZE = 60;

/**
 * Props: { size?, padding?, message, playing, delayMs }
 */
export class Sender extends React.Component {
    interv = 0;
    message = [];

    constructor(props) {
        super(props);
        this.state = {
            data: '#',
        }
    }

    componentWillUnmount() {
        this.stopInterval();
    }

    prepMessaage() {
        this.message = [];
        const rawMessage = this.props.message;
        const len = rawMessage.length;
        let cnt = 0;
        for(let i=0; i < len; i+= QR_SIZE) {
            this.message.push(`${cnt++}|${rawMessage.substr(i, QR_SIZE)}`)
        }
        this.message.push(`${cnt}|___END___`);
    }

    startInterval() {
        if (this.interv) {
            return;
        }
        this.prepMessaage();
        const stt = { idx: 0, msg: this.message };
        this.interv = setInterval(() => {
            stt.idx = stt.idx + 1;
            if (stt.idx > stt.msg.length - 1) {
                stt.idx = 0;
            }
            const data = stt.msg[stt.idx];
            this.setState({...this.state, data: data});
        }, this.props.delayMs || 300);
    }

    stopInterval() {
        if (this.interv) {
            clearInterval(this.interv);
            this.interv = 0;
        }
    }

    render() {
        if (this.props.playing) {
            this.startInterval();
        } else {
            this.stopInterval();
        }

        const size = this.props.size || 300;
        const padding = this.props.padding || 15;
        return (
            <View style={{height: size, width: size, padding: padding}}>
                <QRCode
                    value={this.state.data}
                    size={size - padding}
                    bgColor='black'
                    fgColor='white'/>
            </View>
        );
    }
};