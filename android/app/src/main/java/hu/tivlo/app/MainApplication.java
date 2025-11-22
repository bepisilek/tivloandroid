package hu.tivlo.app;

import android.app.Application;
import androidx.multidex.MultiDex;
import android.content.Context;

public class MainApplication extends Application {

    @Override
    public void onCreate() {
        super.onCreate();
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }
}
