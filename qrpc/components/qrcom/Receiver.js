import React from "react";
import {BarCodeScanner, Camera, Permissions, Svg} from "expo";
import {MonoText} from "../StyledText";
import {Text, TouchableOpacity, View, TextInput, Button} from "react-native";

export * as React from 'React';

export default class Receiver extends React.Component {
    camera = null;
    constructor(props) {
        super(props);
        this.reset();
    }

    reset() {
        this.state = {
            hasCameraPermission: null,
            type: Camera.Constants.Type.back,
            messages: new Set(),
            allAreRead: false,
            progress: 0,
            messageSize: null,
            showData: false,
        }
    }

    addBarcode(data) {
        if (data.indexOf('|') > 0){
            this.state.messages.add(data);
            this.checkIsDone();
        }
        console.log('GOT ', data);
    }

    async componentWillMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }

    componentWillUnmount() {
        if (this.camera) {
            this.camera = null;
        }
    }

    checkIsDone() {
        const msgs = Array.from(this.state.messages);
        if (!this.state.messageSize) {
            const last = msgs.find(m => m.indexOf('___END___') > 0);
            if (last) {
                const size = Number(last.split('|')[0]);
                this.setState({...this.state, messageSize: size});
            }
        } else {
            if (this.state.messageSize === msgs.length) {
                this.setState({...this.state, allAreRead: true})
            }
        }
    }

    renderProgress() {
        const progress = this.state.messageSize ? 100 * this.state.messages.size / this.state.messageSize : null;
        const reading = this.state.messages.size;
        if (!reading) {
            return (
                <MonoText> no sender detected </MonoText>
            )
        }
        if (progress) {
            return (
                <MonoText> {this.state.messages.size} out of {this.state.messageSize} lines </MonoText>
            )
        } else {
            return (
                <MonoText> {this.state.messages.size} lines read </MonoText>
            )
        }
    }

    renderCam() {
       return  (
           <Camera
               ref={ref => { this.camera = ref; }}
               style={{flex: 1, width: 300, height: 300}}
               type={this.state.type}
               barCodeScannerSettings={{
                   barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr]
               }}
               onBarCodeScanned={d => this.addBarcode(d.data)}
           >
               <View
                   style={{
                       flex: 1,
                       backgroundColor: 'transparent',
                       flexDirection: 'row',
                   }}>
                   <TouchableOpacity
                       style={{
                           flex: 0.1,
                           alignSelf: 'flex-end',
                           alignItems: 'center',
                       }}
                       onPress={() => {
                           this.setState({
                               type: this.state.type === Camera.Constants.Type.back
                                   ? Camera.Constants.Type.front
                                   : Camera.Constants.Type.back,
                           });
                       }}>
                       <Text
                           style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                           {' '}Flip{' '}
                       </Text>
                   </TouchableOpacity>
               </View>
           </Camera>
       );
    }

    render() {
        const { hasCameraPermission } = this.state;

        if (this.state.allAreRead) {
            const items = Array.from(this.state.messages).map(t => t.split('|', 2));
            items.sort((a, b) => Number(a[0])-Number(b[0]));
            const fullText = items.map(t => t[1]).join('\n');
            return (
                <View style={{ flex: 1, height: 300, width: 300}}>
                    {this.state.showData ?
                        <TextInput
                            multiline={true}
                            numberOfLines = {4}
                            readonly={true}
                            value={fullText}
                        /> :
                        <View>
                            <Svg height={50} width={50} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <Svg.Path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"/>
                            </Svg>

                            <Button title="Show Data" onPress={() => this.setState({...this.state, showData: true})} />
                        </View>
                    }

                </View>
            )
        }

        return (
            <View>
                {hasCameraPermission === null ? <View /> :
                    hasCameraPermission === false ? <Text>No access to camera</Text> :
                        this.renderCam()}
                {this.renderProgress()}
            </View>
        );
    }
}