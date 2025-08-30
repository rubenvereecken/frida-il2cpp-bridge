#include <dlfcn.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/wait.h>
#include <unistd.h>

#ifdef __APPLE__
#define LIB_NAME "GameAssembly.dylib"
#else
#define LIB_NAME "GameAssembly.so"
#endif

int
main (int argc, char ** argv)
{
  char * path = argv[1];
  char * so = LIB_NAME;
  char * data = "Data";

  char * sopath = malloc (strlen (path) + 1 + strlen (so) + 1);
  sprintf (sopath, "%s/%s", path, so);
  printf ("sopath: %s\n", sopath);

  char * datapath = malloc (strlen (path) + 1 + strlen (data) + 1);
  sprintf (datapath, "%s/%s", path, data);

  if (access (sopath, F_OK) != 0)
  {
    printf ("Couldn't find shared library at %s\n", sopath);
    return -1;
  }

  void * handle = dlopen (sopath, RTLD_NOW | RTLD_GLOBAL | RTLD_FIRST);

  if (handle == NULL)
  {
    printf ("dlopen failed: %s\n", dlerror ());
    return -1;
  }

  usleep (100000); // 100ms

  void (*il2cpp_set_data_dir) (const char *) =
      dlsym (handle, "il2cpp_set_data_dir");

  (*il2cpp_set_data_dir) (datapath);

  free (datapath);

  int (*il2cpp_init) (const char *) = dlsym (handle, "il2cpp_init");

  // printf ("il2cpp_init: %p\n", il2cpp_init);

  // il2cpp_init returns true (1) on success
  int res = (*il2cpp_init) ("IL2CPP ROOT DOMAIN");

  if (res == 1)
  {
    printf ("✔️ il2cpp_init succeeded\n");
  }
  else
  {
    printf ("❌ il2cpp_init failed (return value: %d)\n", res);
  }

  // printf ("pid: %d\n", getpid ());

  // int status;
  // wait (&status);
  pause ();
}