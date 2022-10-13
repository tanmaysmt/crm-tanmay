import { TestBed } from '@angular/core/testing';

import { FirebasePushNotificationService } from './firebase-push-notification.service';

describe('FirebasePushNotificationService', () => {
  let service: FirebasePushNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebasePushNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
