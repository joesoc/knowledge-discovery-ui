import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { QmsService } from './qms.service';

fdescribe('QmsService Integration', () => {
  let service: QmsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule], // use HttpClientModule instead of HttpClientTestingModule
      providers: [QmsService]
    });

    service = TestBed.inject(QmsService);
  });

  it('should call the real API and return data', (done) => {
    const query = 'some actual query';
    let ref:string = "PGlkIHQ9IkZpbGUiIHM9Ik4zNkQxN0I5OTAxOTUxMDAwRThFRTYxNzI1Mjg1Qzk2RCIgcj0iZmUyNWYxNmUtZjU2NS00YmY4LThkYmEtMzcyZWIzYWJmYjI4OmEwM2U1OGJhLTQ3M2QtNGIxZC1hZTU4LTlmMjkzZmE2OWYwZTo5OWMwYjdjNy1lZTc3LTRkY2YtODIwNi00ZDQ1ZTJhNTE1MzM6L0FjY291bnRzL0FtcGVyZUF1dG9tb3RpdmUvMjAxNS9TdHJhdGVneTo4NyI+PHAgbj0iRk9MREVSUEFUSCIgdj0iL0FjY291bnRzL0FtcGVyZUF1dG9tb3RpdmUvMjAxNS9TdHJhdGVneS9BbXBlcmVBdXRvbW90aXZlX0FjY291bnRDb250ZXh0XzIwMTUtMDYtMDEuZG9jeCIvPjxwIG49IklTRklMRSIgdj0iVHJ1ZSIvPjxwIG49IkxJU1RJRCIgdj0iOTljMGI3YzctZWU3Ny00ZGNmLTgyMDYtNGQ0NWUyYTUxNTMzIi8+PHAgbj0iTElTVElURU1JRCIgdj0iODciLz48cCBuPSJTSVRFQ09MTEVDVElPTklEIiB2PSJmZTI1ZjE2ZS1mNTY1LTRiZjgtOGRiYS0zNzJlYjNhYmZiMjgiLz48cCBuPSJTSVRFQ09MTEVDVElPTlVSTCIgdj0iaHR0cHM6Ly95ZHA0Zy5zaGFyZXBvaW50LmNvbS8iLz48cCBuPSJTSVRFSUQiIHY9ImEwM2U1OGJhLTQ3M2QtNGIxZC1hZTU4LTlmMjkzZmE2OWYwZSIvPjxwIG49IlRZUEUiIHY9IkZJTEUiLz48L2lkPg==";
    let security_info:string = "MjE2OjF8DGDfW55gjaTeFR+OagIRNy6vqWMcH8niSgIb/MFudjTkDalyTuURI7K8d+zdEUWzFl0jWKE1aChnaZpBVdKZOeOq3La1LUfnhKbr51j/FxicUDpYmgd9x3uM1wknF8kmZj9bjUj7abHGvgig9zUe/TPJvzjxB2X8PJ3WqFuMH9XosZzcrTtpRRDoJO2kMvtz2E94rkdy2yjXIXWehPbsNNWwLaX4obWXiLOlx+YRKZXBpdsqJ9LJgH6qd23/UmIZ770Chvj70cR92JH9hhBX1ZIRKPCcRMIY";

    service.getContent(ref, security_info).subscribe({
      next: (response) => {
        console.log('API Response:', response);
        expect(response).toBeTruthy();
        done(); // marks the test as complete
      },
      error: (error) => {
        fail(`API call failed: ${error.message}`);
        done();
      }
    });
  });
});
