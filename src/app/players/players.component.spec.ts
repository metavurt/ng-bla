import { async, inject, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { PlayersService } from '../shared/services/players.service';

describe('PlayersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PlayersService
      ],
      imports: [
        HttpModule
      ]
    });
  });

  it('should construct', async(inject([PlayersService], (service) => {
    expect(service).toBeDefined();
  })));
});

describe('PlayersService (Mocked)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PlayersService,

        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ],
      imports: [
        HttpModule
      ]
    });
  });

  it('should construct', async(inject(
    [PlayersService, MockBackend], (service, mockBackend) => {

    expect(service).toBeDefined();
  })));

  describe('getLeagueStandings', () => {

    /* simple, non array reflection of expected data */
    const mockResponse = {
      tid: 0, tname: 'Team 0', wid: 8, wins: 23, loss: 9, pcnt: 0.719, tpins: 18282
    };

    it('should parse response from endpoint', async(inject(
      [PlayersService, MockBackend], (service, mockBackend) => {

      mockBackend.connections.subscribe(connection => {
        connection.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(mockResponse) })));
      });

      const result = service.getLeagueStandings();

      result.subscribe(res => {
        expect(res).toEqual({
          tid: 0,
          tname: 'Team 0',
          wid: 8,
          wins: 23,
          loss: 9,
          pcnt: 0.719,
          tpins: 18282
        });
      });

    })));
  });
});