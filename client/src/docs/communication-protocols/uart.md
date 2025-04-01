# UART (Universal Asynchronous Receiver-Transmitter)

## Overview

UART is one of the most common serial communication protocols used in embedded systems. It provides full-duplex communication using just two wires for data transmission (plus ground):

- TX (Transmit) - Sends data from the device
- RX (Receive) - Receives data to the device

Unlike SPI or I2C, UART is asynchronous, meaning it doesn't use a separate clock signal for synchronization. Instead, both sides must agree on timing parameters in advance.

## Key Characteristics

- **Asynchronous Communication**: No shared clock signal
- **Full-Duplex**: Can send and receive simultaneously
- **Point-to-Point**: Typically connects only two devices directly
- **Framing Format**: Start bit, data bits, optional parity bit, stop bit(s)
- **Baud Rate**: Communication speed in bits per second

## Common Baud Rates

- 9600 bps (common for debugging)
- 19200 bps
- 38400 bps
- 57600 bps
- 115200 bps (common for modern applications)

Higher rates are possible but may lead to timing errors depending on the hardware capabilities.

## Data Frame Format

A typical UART transmission consists of:

1. **Idle Line**: High voltage level when no data is being sent
2. **Start Bit**: Always low (0), indicates the beginning of a frame
3. **Data Bits**: 5-9 bits of actual data (typically 8 bits)
4. **Parity Bit**: Optional error detection bit (even or odd parity)
5. **Stop Bit(s)**: 1, 1.5, or 2 bits, always high (1), indicates the end of a frame

## Hardware Implementation

In microcontrollers, UART can be implemented as:

- **Hardware UART**: Dedicated peripheral with built-in support
- **Software UART**: Bit-banging implementation using GPIO pins

Hardware UART is preferred as it's more reliable and offloads timing-critical operations from the CPU.

## Configuration Parameters

When setting up UART communication, you need to configure:

- **Baud Rate**: Must match between devices
- **Data Bits**: Typically 8, but can be 5-9
- **Parity**: None, Even, or Odd
- **Stop Bits**: 1, 1.5, or 2
- **Flow Control**: Optional (RTS/CTS or XON/XOFF)

## Example C Code for Initialization

```c
// Initialize UART with 8 data bits, no parity, 1 stop bit at 9600 baud
void uart_init(void) {
    // Assuming a 16MHz clock
    // UBRR value for 9600 baud: 16000000/(16*9600)-1 = 103
    UBRRL = 103;  // Low byte
    UBRRH = 0;    // High byte
    
    // Enable receiver and transmitter
    UCSRB = (1 << RXEN) | (1 << TXEN);
    
    // Set frame format: 8 data bits, no parity, 1 stop bit
    UCSRC = (1 << URSEL) | (1 << UCSZ1) | (1 << UCSZ0);
}

// Send a byte over UART
void uart_transmit(uint8_t data) {
    // Wait for empty transmit buffer
    while (!(UCSRA & (1 << UDRE)));
    
    // Put data into buffer, sends the data
    UDR = data;
}

// Receive a byte from UART
uint8_t uart_receive(void) {
    // Wait for data to be received
    while (!(UCSRA & (1 << RXC)));
    
    // Get and return received data from buffer
    return UDR;
}
```

## Common Interview Questions

1. **Q**: How does UART synchronize without a clock signal?  
   **A**: UART uses agreed-upon timing (baud rate) and start/stop bits to frame each byte. The receiver synchronizes on the falling edge of the start bit and samples the data at intervals determined by the baud rate.

2. **Q**: What happens if the baud rates don't match exactly?  
   **A**: Small differences (within ~10%) can usually be tolerated. Larger mismatches cause the receiver to sample bits at the wrong time, resulting in data corruption.

3. **Q**: How would you handle flow control in UART?  
   **A**: Hardware flow control uses RTS/CTS lines to signal readiness. Software flow control uses XON/XOFF control characters to pause/resume transmission.

4. **Q**: How can you detect errors in UART communication?  
   **A**: Common errors include framing errors (invalid stop bit), parity errors (if parity is used), and overrun errors (receiver buffer full). Most UART hardware provides status flags for these conditions.

5. **Q**: What are the advantages and disadvantages of UART compared to other protocols?  
   **A**: Advantages include simplicity, widespread support, and only requiring two wires for communication. Disadvantages include lack of multi-device support without additional logic, no built-in addressing, and relatively slower speeds compared to SPI.

## Advanced Topics

- **DMA with UART**: Offloading data transfers to DMA for better performance
- **Interrupt-Driven UART**: Using interrupts to handle transmission/reception
- **Ring Buffers**: Implementing circular buffers for UART data
- **Error Handling**: Strategies for detecting and recovering from communication errors
- **Line Protocols**: Building higher-level protocols (like command interfaces) on top of UART

## Real-World Applications

- Debug console output
- Communication with sensors and actuators
- Bluetooth modules (HC-05, HC-06)
- GPS modules
- Serial communication with computers (through USB-to-UART bridges)
- Inter-processor communication in simple multi-processor systems