import { useState } from "react";

// Demo file contents
const files = {
  'pwm.c': `// PWM Generator Implementation
// TODO: Complete the code below

#include "timer.h"
#include "gpio.h"

void pwm_init(uint8_t channel, uint32_t frequency) {
  // Initialize the timer peripheral
  timer_init(channel, frequency);

  // Configure GPIO pin as output
  gpio_set_mode(PWM_PORT, PWM_PIN, GPIO_MODE_OUTPUT);

  // TODO: Configure timer for PWM mode

}

void pwm_set_duty_cycle(uint8_t channel, uint8_t duty_cycle) {
  // TODO: Set the PWM duty cycle (0-100%)
  // Hint: Calculate the compare value based on the duty cycle

  uint32_t period = timer_get_period(channel);
  uint32_t compare_value = 0;

  // Set the compare value
}`,

  'timer.h': `#ifndef TIMER_H
#define TIMER_H

#include <stdint.h>

/**
 * @brief Timer configuration structure
 */
typedef struct {
  uint32_t frequency;  // Timer frequency in Hz
  uint32_t period;     // Timer period value
  uint32_t prescaler;  // Timer prescaler value
  uint8_t  mode;       // Timer operating mode
} timer_config_t;

/**
 * @brief Timer modes
 */
typedef enum {
  TIMER_MODE_BASIC = 0,
  TIMER_MODE_PWM,
  TIMER_MODE_INPUT_CAPTURE,
  TIMER_MODE_OUTPUT_COMPARE
} timer_mode_t;

/**
 * @brief Initialize timer with given parameters
 * 
 * @param channel Timer channel (0-7)
 * @param frequency Desired frequency in Hz
 * @return int 0 if successful, error code otherwise
 */
int timer_init(uint8_t channel, uint32_t frequency);

/**
 * @brief Configure timer for PWM mode
 * 
 * @param channel Timer channel (0-7)
 * @param mode PWM mode (edge-aligned, center-aligned)
 * @return int 0 if successful, error code otherwise
 */
int timer_config_pwm_mode(uint8_t channel, uint8_t mode);

/**
 * @brief Get timer's current period value
 * 
 * @param channel Timer channel (0-7)
 * @return uint32_t Current period value
 */
uint32_t timer_get_period(uint8_t channel);

/**
 * @brief Set timer compare value for PWM output
 * 
 * @param channel Timer channel (0-7)
 * @param compare_value Compare value for PWM duty cycle
 * @return int 0 if successful, error code otherwise
 */
int timer_set_compare(uint8_t channel, uint32_t compare_value);

/**
 * @brief Start timer counting
 * 
 * @param channel Timer channel (0-7)
 * @return int 0 if successful, error code otherwise
 */
int timer_start(uint8_t channel);

/**
 * @brief Stop timer counting
 * 
 * @param channel Timer channel (0-7)
 * @return int 0 if successful, error code otherwise
 */
int timer_stop(uint8_t channel);

#endif /* TIMER_H */`,

  'gpio.h': `#ifndef GPIO_H
#define GPIO_H

#include <stdint.h>

/**
 * @brief GPIO port definitions
 */
#define GPIO_PORT_A   0
#define GPIO_PORT_B   1
#define GPIO_PORT_C   2
#define GPIO_PORT_D   3
#define GPIO_PORT_E   4
#define GPIO_PORT_F   5

/**
 * @brief For PWM example
 */
#define PWM_PORT      GPIO_PORT_B
#define PWM_PIN       5

/**
 * @brief GPIO pin modes
 */
typedef enum {
  GPIO_MODE_INPUT = 0,
  GPIO_MODE_OUTPUT,
  GPIO_MODE_ALTERNATE,
  GPIO_MODE_ANALOG
} gpio_mode_t;

/**
 * @brief GPIO output types
 */
typedef enum {
  GPIO_OUTPUT_PUSHPULL = 0,
  GPIO_OUTPUT_OPENDRAIN
} gpio_output_t;

/**
 * @brief GPIO pull resistor configuration
 */
typedef enum {
  GPIO_PULL_NONE = 0,
  GPIO_PULL_UP,
  GPIO_PULL_DOWN
} gpio_pull_t;

/**
 * @brief Set GPIO pin mode
 * 
 * @param port GPIO port
 * @param pin GPIO pin number (0-15)
 * @param mode Pin mode (input, output, alternate, analog)
 * @return int 0 if successful, error code otherwise
 */
int gpio_set_mode(uint8_t port, uint8_t pin, gpio_mode_t mode);

/**
 * @brief Set GPIO output type
 * 
 * @param port GPIO port
 * @param pin GPIO pin number (0-15)
 * @param output_type Output type (push-pull or open-drain)
 * @return int 0 if successful, error code otherwise
 */
int gpio_set_output_type(uint8_t port, uint8_t pin, gpio_output_t output_type);

/**
 * @brief Set GPIO pull-up/pull-down configuration
 * 
 * @param port GPIO port
 * @param pin GPIO pin number (0-15)
 * @param pull Pull configuration (none, up, down)
 * @return int 0 if successful, error code otherwise
 */
int gpio_set_pull(uint8_t port, uint8_t pin, gpio_pull_t pull);

/**
 * @brief Set GPIO alternate function
 * 
 * @param port GPIO port
 * @param pin GPIO pin number (0-15)
 * @param af_number Alternate function number (0-15)
 * @return int 0 if successful, error code otherwise
 */
int gpio_set_alternate(uint8_t port, uint8_t pin, uint8_t af_number);

/**
 * @brief Write value to GPIO pin
 * 
 * @param port GPIO port
 * @param pin GPIO pin number (0-15)
 * @param value 0 for low, non-zero for high
 * @return int 0 if successful, error code otherwise
 */
int gpio_write(uint8_t port, uint8_t pin, uint8_t value);

/**
 * @brief Read value from GPIO pin
 * 
 * @param port GPIO port
 * @param pin GPIO pin number (0-15)
 * @return uint8_t 0 for low, 1 for high
 */
uint8_t gpio_read(uint8_t port, uint8_t pin);

/**
 * @brief Toggle GPIO pin
 * 
 * @param port GPIO port
 * @param pin GPIO pin number (0-15)
 * @return int 0 if successful, error code otherwise
 */
int gpio_toggle(uint8_t port, uint8_t pin);

#endif /* GPIO_H */`
};

interface DemoHeaderFilesProps {
  activeFile: 'pwm.c' | 'timer.h' | 'gpio.h';
}

export default function DemoHeaderFiles({ activeFile }: DemoHeaderFilesProps) {
  // Function to render code with syntax highlighting
  const renderCode = (code: string) => {
    // Split by lines
    const lines = code.split('\n');
    
    // For a simple approach to syntax highlighting
    return lines.map((line, idx) => {
      // Simple syntax highlighting logic
      let formattedLine = line;
      
      // Comments (// and /* */)
      if (line.trim().startsWith('//') || line.trim().startsWith('/*')) {
        return (
          <div key={idx}>
            <span className="text-slate-400">{line}</span>
          </div>
        );
      }
      
      // Functions and typedefs
      if (line.includes('void ') || line.includes('int ') || line.includes('uint') || 
          line.includes('typedef ') || line.includes('#define ')) {
        return (
          <div key={idx}>
            {line.includes('#define') || line.includes('#include') ? (
              <span>
                <span className="text-primary">{line.split(' ')[0]}</span>
                <span className="text-white">{' ' + line.split(' ').slice(1).join(' ')}</span>
              </span>
            ) : line.includes('typedef') ? (
              <span>
                <span className="text-primary">typedef</span>
                <span className="text-white">{' ' + line.split('typedef ')[1]}</span>
              </span>
            ) : (
              <span>
                <span className="text-primary">{line.split(' ')[0]}</span>
                <span className="text-blue-400">{' ' + line.split(' ')[1]}</span>
                <span className="text-white">{' ' + line.split(' ').slice(2).join(' ')}</span>
              </span>
            )}
          </div>
        );
      }
      
      // Headers
      if (line.includes('#ifndef') || line.includes('#endif') || line.includes('#define H')) {
        return (
          <div key={idx}>
            <span className="text-primary">{line}</span>
          </div>
        );
      }
      
      // Function calls
      if (line.includes('(') && line.includes(')') && !line.includes(';')) {
        return (
          <div key={idx}>
            <span className="text-white">{line}</span>
          </div>
        );
      }
      
      // Default styling
      return <div key={idx}><span className="text-slate-200">{line}</span></div>;
    });
  };
  
  return (
    <div className="font-mono text-sm flex-1 bg-[#1e1e1e] overflow-y-auto">
      {renderCode(files[activeFile])}
    </div>
  );
}