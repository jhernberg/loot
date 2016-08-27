'use strict';

let requestIdCounter = 0;
const cancelledRequestIds = [];

/* Mock the window.cefQuery method */
window.cefQuery = (obj) => {
  if (obj.request === '{"name":"fail","args":[]}') {
    obj.onFailure(-1, obj.request);
  } else if (obj.request === 'test') {
    obj.onSuccess('passed');
  }

  return requestIdCounter++;
};

window.cefQueryCancel = (id) => {
  cancelledRequestIds.push(id);
};

describe('Query', () => {
  describe('#Query()', () => {
    it('should throw if no arguments are passed', () => {
      (() => { new loot.Query(); }).should.throw(); // eslint-disable-line no-new
    });

    it('should initialise cancelled as false', () => {
      const query = new loot.Query('test');

      query.cancelled.should.be.false();
    });

    it('should leave the query ID undefined', () => {
      const query = new loot.Query('test');

      should(query.id).be.undefined();
    });

    it('should convert the query parameters to a JSON string', () => {
      const query = new loot.Query('foo', 'bar', 'baz');

      query.request.should.equal('{"name":"foo","args":["bar","baz"]}');
    });

    it('should convert empty rest parameters to an empty JSON array', () => {
      const query = new loot.Query('foo');

      query.request.should.equal('{"name":"foo","args":[]}');
    });
  });

  describe('#send()', () => {
    it('should return a promise', () => {
      const query = new loot.Query('test');

      query.send().should.be.a.Promise(); // eslint-disable-line new-cap
    });

    it('should succeed if the query is recognised', () => {
      const query = new loot.Query('test');

      query.send().should.be.fulfilledWith('passed');
    });

    it('should fail with an Error object when an error occurs', () => {
      const query = new loot.Query('fail');

      query.send().should.be.rejectedWith(Error, { message: 'Error code: -1; fail' });
    });

    it('should set the query id', () => {
      const query = new loot.Query('fail');

      query.send();

      should(query.id).not.be.undefined();
    });
  });

  describe('#cancel()', () => {
    it('should not cancel the request if the request has not been sent', () => {
      const query = new loot.Query('test');

      query.cancel();

      query.cancelled.should.be.false();
      cancelledRequestIds.should.not.containEql(query.id);
    });

    it('should cancel the request if the request has been sent', () => {
      const query = new loot.Query('test');

      const result = query.send();
      query.cancel();

      query.cancelled.should.be.true();
      cancelledRequestIds.should.containEql(query.id);
      result.should.be.rejectedWith(undefined);
    });
  });

  describe('#send() [static]', () => {
    it('should throw if no arguments are passed', () => {
      (() => { loot.Query.send(); }).should.throw(); // eslint-disable-line no-new
    });

    it('should return a promise', () => {
      loot.Query.send('test').should.be.a.Promise(); // eslint-disable-line new-cap
    });

    it('should succeed if a request name is passed', () => {
      loot.Query.send('test').should.be.fulfilledWith('passed');
    });

    it('should fail with an Error object when an error occurs', () => {
      loot.Query.send('fail').should.be.rejectedWith(Error, { message: 'Error code: -1; fail' });
    });
  });
});
