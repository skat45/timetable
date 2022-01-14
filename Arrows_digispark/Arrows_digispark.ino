#include "DigiKeyboard.h"
#define l 2
#define r 0

void setup() {
  pinMode(l, INPUT);
  pinMode(r, INPUT);
}

#define between_clicks_time 250
uint64_t left_t = 0;
uint64_t right_t = 0;

void loop() {
  uint64_t t = millis();
  if (digitalRead(r) && t - right_t >= between_clicks_time) {
    DigiKeyboard.sendKeyStroke(KEY_ARROW_LEFT - 1);
    DigiKeyboard.sendKeyStroke(0, 0);
    right_t = t;
  }
  if (digitalRead(l) && t - left_t >= between_clicks_time) {
    DigiKeyboard.sendKeyStroke(KEY_ARROW_LEFT);
    DigiKeyboard.sendKeyStroke(0, 0);
    left_t = t;
  }
}
