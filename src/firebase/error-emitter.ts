'use client';

import { EventEmitter } from 'events';

// A simple way to communicate errors across the app
class ErrorEmitter extends EventEmitter {}

export const errorEmitter = new ErrorEmitter();
