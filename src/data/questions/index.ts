import { Question } from '../../types';

import react from './react';
import react_extra from './react_extra';
import typescript from './typescript';
import js_core from './js_core';
import redux from './redux';
import dotnet from './dotnet';
import aspnet from './aspnet';
import ef_linq from './ef_linq';
import database from './database';
import security from './security';
import solid from './solid';
import microservices from './microservices';
import system_design from './system_design';
import performance from './performance';
import testing from './testing';
import devops from './devops';
import scenario from './scenario';
import string_js from './string_js';
import string_cs from './string_cs';
import hr_behavior from './hr_behavior';
import db_code from './db_code';

export const QUESTIONS: Record<string, Question[]> = {
  react,
  react_extra,
  typescript,
  js_core,
  redux,
  dotnet,
  aspnet,
  ef_linq,
  database,
  security,
  solid,
  microservices,
  system_design,
  performance,
  testing,
  devops,
  scenario,
  string_js,
  string_cs,
  hr_behavior,
  db_code,
};

export const ALL_QUESTIONS: Question[] = Object.values(QUESTIONS).flat();
