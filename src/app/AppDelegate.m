#import "AppDelegate.h"
#import "MainViewController.h"
#import <OneSignal/OneSignal.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication*)application didFinishLaunchingWithOptions:(NSDictionary*)launchOptions
{
    // Replace '830c4a85-aa8b-471f-be28-1fb51bd6dbce' with your OneSignal App ID.
    [OneSignal initWithLaunchOptions:launchOptions
                              appId:@"830c4a85-aa8b-471f-be28-1fb51bd6dbce"
   				 handleNotificationAction:nil
                            settings:@{kOSSettingsKeyAutoPrompt: @false}];
   OneSignal.inFocusDisplayType = OSNotificationDisplayTypeNotification;
   
   // Recommend moving the below line to prompt for push after informing the user about
   //   how your app will use them.
   [OneSignal promptForPushNotificationsWithUserResponse:^(BOOL accepted) {
        NSLog(@"User accepted notifications: %d", accepted);
   }];

    self.viewController = [[MainViewController alloc] init];
    return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

@end